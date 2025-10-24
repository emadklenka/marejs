// server.js
import express from "express";
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from "path";
import fs from "fs";
import net from "net";
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from "url";
import { detectPathTraversal } from "./waf/pathtraversal.js";
import { wafMiddleware } from "./waf/waf.js";

import { getMarecors } from "../api/__mare_serversettings/cors.js";
import { getMareSession } from "../api/__mare_serversettings/session.js";
import { Server_Startup } from "../api/__mare_serversettings/server_startup.js";
//import { mareMiddleware, mareRateLimiter } from "../api/__mare_serversettings/middleware.js";
import { mareMiddleware } from "../api/__mare_serversettings/middleware.js";

// ==== Setup ====
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const jsonLimit = process.env.JSON_LIMIT || "256mb";
app.use(express.json({ limit: jsonLimit }));

// Global rate limiter
//app.use(mareRateLimiter);

const isDev = process.env.NODE_ENV === "development";

// ==== WAF Safe Routes Configuration ====
let safeRoutesConfig = { exact: [], patterns: [], partial: [] };

/**
 * Get the loaded safe routes configuration
 * @returns {Object} Safe routes config
 */
export function getSafeRoutes() {
  return safeRoutesConfig;
}

/**
 * Load WAF safe routes configuration from saferoutes.config.js
 */
async function loadSafeRoutes() {
  try {
    const safeRoutesPath = path.resolve(__dirname, "../saferoutes.config.js");
    if (fs.existsSync(safeRoutesPath)) {
      const module = await import(pathToFileURL(safeRoutesPath).href);
      safeRoutesConfig = module.default || { exact: [], patterns: [], partial: [] };
      console.log("[MARE SERVER] WAF safe routes configuration loaded");
      if (safeRoutesConfig.exact?.length > 0 || safeRoutesConfig.patterns?.length > 0 || safeRoutesConfig.partial?.length > 0) {
        console.log(`[MARE SERVER] Safe routes: ${safeRoutesConfig.exact?.length || 0} exact, ${safeRoutesConfig.patterns?.length || 0} patterns, ${safeRoutesConfig.partial?.length || 0} partial`);
      }
    } else {
      console.log("[MARE SERVER] No saferoutes.config.js found - WAF will check all routes");
    }
  } catch (err) {
    console.warn("[MARE SERVER] Failed to load saferoutes.config.js:", err.message);
    console.warn("[MARE SERVER] WAF will check all routes (no bypasses)");
  }
}

 

// ==== API Routing ====
const dynamicImport = async (routePath) => {
  try {
    // Check if path exists and is a file before importing
    if (!fs.existsSync(routePath) || !fs.statSync(routePath).isFile()) {
      return null;
    }

    const route = await import(pathToFileURL(routePath).href);
    return route.default;
  } catch (err) {
    console.error(`Failed to import ${routePath}:`, err);
    return null;
  }
};

app.use("/api",
  wafMiddleware,  // WAF runs FIRST to catch attacks early
 // mareRateLimiter,
  getMareSession(),
  getMarecors(),
  mareMiddleware,
  async (req, res, next) => {
  let routePath = path.join(__dirname, req.path);
  
  // Enhanced path traversal protection
  const normalizedPath = path.normalize(req.path);
  
  // Check for path traversal attempts using multiple techniques
  const hasTraversal =detectPathTraversal(normalizedPath)
  //  normalizedPath.includes('..') ||
  //                     req.path.includes('..') ||
  //                     req.path.includes('%2e%2e') ||
  //                     req.path.includes('%2e.') ||
  //                     req.path.includes('.%2e');
  
  if (hasTraversal) {
    return res.status(400).json({ error: "Invalid API path - path traversal detected" });
  }
  
const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
const resolvedPath = path.resolve(__dirname, '..', 'api', cleanPath);
const apiBasePath = path.resolve(__dirname, '..', 'api');

// Make sure resolvedPath is inside apiBasePath
if (path.relative(apiBasePath, resolvedPath).startsWith('..') || path.isAbsolute(path.relative(apiBasePath, resolvedPath))) {
  return res.status(400).json({ error: "Invalid API path - outside allowed directory" });
}

  // Use path.sep for cross-platform compatibility (Windows uses backslash, Unix uses forward slash)
  routePath = routePath.split(path.sep).map(segment =>
    segment === '.mareJS' ? 'api' : segment
  ).join(path.sep);
  const indexFilePath = path.join(routePath, "index.js");
  const filePath = `${routePath}.js`;

  let routeHandler = null;

  if (fs.existsSync(indexFilePath) && fs.statSync(indexFilePath).isFile()) {
    routeHandler = await dynamicImport(indexFilePath);
  }

  if (!routeHandler && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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

    if (fs.existsSync(parentPath) && fs.statSync(parentPath).isFile()) {
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

// ==== Dev/Prod static File Handling ====
 
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

  // Load WAF safe routes configuration (framework internal)
  await loadSafeRoutes();

  // Run user-defined startup logic
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
