// server.js
import express from "express";
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from "path";
import fs from "fs";
import net from "net";
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from "url";

import { getMarecors } from "../api/__mare_serversettings/cors.js";
import { getMareSession } from "../api/__mare_serversettings/session.js";
import { Server_Startup } from "../api/__mare_serversettings/server_startup.js";
import { mareMiddleware } from "../api/__mare_serversettings/middleware.js";

// ==== Setup ====
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

const isDev = process.env.NODE_ENV === "development";

// ==== Middleware ====
const msession = getMareSession();
if (msession) app.use(msession);

const mcors = getMarecors();
if (mcors) app.use(mcors);

app.use(mareMiddleware);

// ==== API Routing ====
const dynamicImport = async (routePath) => {
  try {
    const route = await import(pathToFileURL(routePath).href);
    return route.default;
  } catch (err) {
    console.error(`Failed to import ${routePath}:`, err);
    return null;
  }
};

app.use("/api", async (req, res, next) => {
  let routePath = path.join(__dirname, req.path);
  if (req.path.includes("..") || req.path.startsWith("./") || req.path.startsWith(".")) {
    return res.status(400).send("Invalid API path");
  }

  routePath = routePath.replace(".mareJS", "api");
  const indexFilePath = path.join(routePath, "index.js");
  const filePath = `${routePath}.js`;

  let routeHandler = null;

  if (fs.existsSync(indexFilePath)) {
    routeHandler = await dynamicImport(indexFilePath);
  }

  if (!routeHandler && fs.existsSync(filePath)) {
    routeHandler = await dynamicImport(filePath);
  }

  const segments = req.path.split("/").filter(Boolean);
  const parentElement = segments.shift();
  let params = {};

  if (!routeHandler && parentElement) {
    let parentPath = path.join(__dirname, "..", "api", parentElement);
    if (fs.existsSync(parentPath)) {
      for (let i = 0; i < segments.length; i++) {
        if (fs.existsSync(path.join(parentPath, segments[i]))) {
          parentPath = path.join(parentPath, segments[i]);
        } else {
          const files = fs.readdirSync(parentPath);
          for (const file of files) {
            if (file.startsWith("[")) {
              parentPath = path.join(parentPath, file);
              const paramName = file.slice(1, file.indexOf("]"));
              params[paramName] = segments[i];
              break;
            }
          }
        }
      }
    }

    if (fs.existsSync(parentPath)) {
      routeHandler = await dynamicImport(parentPath);
      if (routeHandler) req.params = params;
    }
  }

  if (routeHandler) return routeHandler(req, res, next);

  const defaultFilePath = "api/default.js";
  if (fs.existsSync(defaultFilePath)) {
    routeHandler = await dynamicImport(defaultFilePath);
    try {
      return routeHandler(req, res, next);
    } catch (e) {
      console.error("Error in /api/default route:", e);
      res.status(500).end("Server Error");
    }
  }
});

// ==== Dev/Prod File Handling ====
if (isDev) {
  console.log("----- Development Mode Server ----------------");
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({ server: { middlewareMode: true } });
  app.use(vite.middlewares);

  app.get("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      const template = await vite.transformIndexHtml(url, "");
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).end(err.message);
    }
  });
} else {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    const indexHtml = path.join(distPath, "index.html");
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

// ==== Port Handling ====
const checkPortAvailable = (port) =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => (err.code === "EADDRINUSE" ? resolve(false) : reject(err)));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });

const findAvailablePort = async (startingPort) => {
  let port = startingPort;
  while (!(await checkPortAvailable(port))) {
    console.log(`Port ${port} is busy, trying next one...`);
    port++;
  }
  return port;
};

// ==== WebSocket Router ====================================================
const wshandlers = {};
const WSS_DIR = path.resolve('./api/wss');

async function loadWSHandler(routeName) {
  const file = path.join(WSS_DIR, `${routeName}.js`);
  if (!fs.existsSync(file)) return null;
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}
 
async function setupWSSRouting(server) {
  const wss = new WebSocketServer({ noServer: true });

 server.on('upgrade', async (req, socket, head) => {
  const fullUrl = new URL(`http://localhost${req.url}`); // ✅ Properly parse pathname + query

  if (!fullUrl.pathname.startsWith('/api/wss/')) return socket.destroy();

  const route = fullUrl.pathname.replace('/api/wss/', '').replace(/\/+$/, '');
  const queryParams = Object.fromEntries(fullUrl.searchParams.entries());

  console.log('[WSS] Incoming route:', route);


  if (!wshandlers[route]) {
    const handler = await loadWSHandler(route);
    if (!handler) {
      console.warn(`❌ No WS handler for ${route}`);
      return socket.destroy();
    }
    wshandlers[route] = handler;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    req.query = queryParams; // ✅ Attach parsed query params to req
    wshandlers[route](ws, req);
  });
});

}

// ==== Startup ====
(async () => {
  const startingPort = process.env.PORT || 4000;
  const PORT = await findAvailablePort(startingPort);

  const ready = await Server_Startup();
  if (!ready) {
    console.error("SERVER FAILED TO START BECAUSE OF STARTUP SCRIPT ERROR");
    return;
  }

  const server = createServer(app);
  await setupWSSRouting(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
