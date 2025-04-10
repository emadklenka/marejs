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

import { Server_Startup } from "../api/__mare_serversettings/server_startup.js";

import dotenv from 'dotenv';
dotenv.config();
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const isDev = process.env.NODE_ENV === "development";

// Middleware to handle sessions (if required)
const msession = getMareSession();
if (msession) app.use(msession);
const mcors = getMarecors();
if (mcors) {
  app.use(mcors);
}
//////////
import{mareMiddleware} from "../api/__mare_serversettings/middleware.js";
app.use(mareMiddleware);

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
  if (req.path.includes("..") || req.path.startsWith("./") || req.path.startsWith(".")) {
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


  const segments = req.path.split("/").filter(Boolean); ///viewfile/[test]/[id].js => ["viewfile","[test]","[id]"]
  const parentElement = segments.shift(); //parenteElement = viewfile , segments = ["[test]","[id]"]
 
  if (!routeHandler &&parentElement) {
    //Check if the api/folder has dynamic route files.
    //If the folder has dynamic routes,start adding dynamic route names to params variable.
    //then call the file of the dynamic route
    //for example:
    //If i have /viewfile/[test]/[id].js
    //and I get an api call of /viewfile/233/21 then call /viewfile/[test]/[id].js
    //and pass the params as {test:233,id:21}
    //and if no matching route, then proceed to calling the nats

    //Taking /viewFile/[test]/[id].js as an example
    // Split the request path into segments and filter out any empty segments

    // Remove the first segment and store it in parentElement
  
    // Construct the initial parent path using __dirname and parentElement
    let parentPath = path.join(__dirname, "..", "api", parentElement); //parentPath = (base project dir)/viewfile

    // Initialize an empty object to store dynamic parameters
    let params = {};

    if (fs.existsSync(parentPath)) {
      // Iterate through the remaining segments
      for (let i = 0; i < segments.length; i++) {
        // Check if the current segment exists as a directory or file in the parent path
        if (fs.existsSync(path.join(parentPath, segments[i]))) {
          // Update the parent path to include the current segment
          parentPath = path.join(parentPath, segments[i]); //in case of no dynamic route, parentPath = (base project dir)/viewfile/(file)
        } else {
          // If the current segment does not exist, check for dynamic files in the parent path
          let files = fs.readdirSync(parentPath);
          for (let j = 0; j < files.length; j++) {
            // Check if the file name starts with '[' indicating a dynamic segment
            if (files[j].startsWith("[")) {
              // Update the parent path to include the dynamic file
              parentPath = path.join(parentPath, files[j]); //parentPath = (base project dir)/viewfile/[test] Then (base project dir)/viewfile/[test]/[id].js

              // Extract the parameter name from the dynamic file name (e.g., [param].js)
              const paramName = files[j].slice(1, files[j].indexOf("]")); //paramName = test then paramName = id

              // Add the dynamic segment value to the params object with the parameter name
              params[paramName] = segments[i]; //params = {test:233} then params = {test:233,id:21}
              break; //stop looping through all the parent files.
            }
          }
        }
      }
    }

    // Check if the final parent path exists
    if (fs.existsSync(parentPath)) {
      // Dynamically import the route handler from the final parent path
      routeHandler = await dynamicImport(parentPath);
      if (routeHandler) {
        // If a route handler is found, add the dynamic parameters to the request object
        req.params = params;
      }
    }
  }

  if (routeHandler) {
    return routeHandler(req, res, next);
  }

  const defaultFilePath = "api/default.js";
  if (fs.existsSync(defaultFilePath)) {
    routeHandler = await dynamicImport(defaultFilePath);
    try {
      return routeHandler(req, res, next);
    } catch (e) {
      console.error("Error in /api/default route :", e);
      res.status(500).end("Server Error");
    }
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
  const startingPort = process.env.PORT || 4000;
  const PORT = await findAvailablePort(startingPort);
  //AWAIT SERVER STARTUP
  const ready =await Server_Startup();
  if (! ready) { console.error("SERVER FAILED TO START BECAUSE OF STARTUP SCRIPT ERROR");  return;}
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); 
  });
})();
//////////////////////////////////////////////////////////////////
