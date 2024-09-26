import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { pathToFileURL } from 'url';
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Middleware to handle sessions (if required)
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Enable CORS for React
app.use(cors({
  origin: 'http://localhost:3000', // Your Vite server
  credentials: true
}));

// Helper function to dynamically import route


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
app.use('/api', async (req, res, next) => {
  const routePath = path.join(__dirname, req.path);

  // Prevent directory traversal attempts like ../../ or ./
  if (req.path.includes('..') || req.path.startsWith('./') || req.path.startsWith('.')) {
    return res.status(400).send('Invalid API path');
  }

  const indexFilePath = path.join(routePath, 'index.js');
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
    return res.status(404).send('API route not found');
  }
});//


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
