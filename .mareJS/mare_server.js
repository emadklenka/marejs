import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import net from "net";
import { pathToFileURL } from "url";
// import getMarecors   from '../api/__mare_serversettings/cors';
// import { getMareSession } from '../api/__mare_serversettings/session';
import { getMarecors } from "../api/__mare_serversettings/cors.js";
import { getMareSession } from "../api/__mare_serversettings/session.js";
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isDev = process.env.NODE_ENV === "development";

// Middleware to handle sessions (if required)
const msession = getMareSession();
if (msession) app.use(msession);
const mcors = getMarecors();
if (mcors) {
  app.use(mcors);
}
// Helper function to dynamically import route
const dynamicImport = async (routePath) => {
 
  try {
    const route = await import(pathToFileURL(routePath).href);
    return route.default;
  } catch (err) {
    console.error(`Failed to import ${routePath}:`, err);
    return null;
  }
};

// Dynamic Route Loader for /api/* requests
app.use("/api", async (req, res, next) => {
  let routePath = path.join(__dirname, req.path);

  // Prevent directory traversal attempts like ../../ or ./
  if (
    req.path.includes("..") ||
    req.path.startsWith("./") ||
    req.path.startsWith(".")
  ) {
    return res.status(400).send("Invalid API path");
  }

  routePath = routePath.replace(".mareJS", "api");

  const indexFilePath = path.join(routePath, "index.js");
  const filePath = `${routePath}.js`; // Check for pathname.js

  let routeHandler = null;

  // First, check if /api/pathname/index.js exists
  if (fs.existsSync(indexFilePath)) {
    routeHandler = await dynamicImport(indexFilePath);
  }

  // If no index.js, check if /api/pathname.js exists
  if (!routeHandler && fs.existsSync(filePath)) {
    routeHandler = await dynamicImport(filePath);
  }

  if (routeHandler) {
    return routeHandler(req, res, next);
  } else {
    routeHandler = await dynamicImport("api/default.js");
    return routeHandler(req, res, next);
  }
});

// Vite Dev Server for Development Mode
if (isDev) {
  console.log("----- Development Mode Server ----------------");
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  // Use Vite's middleware for development
  app.use(vite.middlewares);

  // Catch-all route to serve the index.html through Vite in development
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
  // Production Mode: Serve static files from the dist directory
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  // Catch-all route: Serve the built index.html for any other route
  app.get("*", (req, res) => {
    const indexHtml = path.join(distPath, "index.html");
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

/////////////////////////////////////////////////////////////////////////
// Function to check if a port is available

const checkPortAvailable = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false); // Port is in use
      } else {
        reject(err); // Some other error
      }
    });

    server.once("listening", () => {
      server.close();
      resolve(true); // Port is available
    });

    server.listen(port);
  });
};

const findAvailablePort = async (startingPort) => {
  let port = startingPort;
  let available = false;

  while (!available) {
    available = await checkPortAvailable(port);
    if (!available) {
      console.log(`Port ${port} is busy, trying next one...`);
      port++; // Try the next port
    }
  }

  return port;
};

(async () => {
  const startingPort = process.env.PORT || 5000;
  const PORT = await findAvailablePort(startingPort);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
//////////////////////////////////////////////////////////////////
