import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safe routes configuration loaded at startup
let safeRoutesConfig = { exact: [], patterns: [], partial: [] };

/**
 * Get the loaded safe routes configuration
 * @returns {Object} Safe routes config
 */
export function getSafeRoutes() {
  return safeRoutesConfig;
}

/**
 * Server startup initialization function
 * Place your application's mandatory startup logic here
 * @returns {Promise<boolean>} True if startup succeeds, false if it fails
 */
export async function Server_Startup() {
  try {
    // Load WAF safe routes configuration
    try {
      const safeRoutesPath = path.resolve(__dirname, "../../saferoutes.config.js");
      if (fs.existsSync(safeRoutesPath)) {
        const module = await import(`file://${safeRoutesPath}`);
        safeRoutesConfig = module.default || { exact: [], patterns: [], partial: [] };
        console.log("[SERVER STARTUP] WAF safe routes configuration loaded");
        if (safeRoutesConfig.exact?.length > 0 || safeRoutesConfig.patterns?.length > 0 || safeRoutesConfig.partial?.length > 0) {
          console.log(`[SERVER STARTUP] Safe routes: ${safeRoutesConfig.exact?.length || 0} exact, ${safeRoutesConfig.patterns?.length || 0} patterns, ${safeRoutesConfig.partial?.length || 0} partial`);
        }
      } else {
        console.log("[SERVER STARTUP] No saferoutes.config.js found - WAF will check all routes");
      }
    } catch (err) {
      console.warn("[SERVER STARTUP] Failed to load saferoutes.config.js:", err.message);
      console.warn("[SERVER STARTUP] WAF will check all routes (no bypasses)");
    }

    // Add your server initialization logic here
    // Example: database connections, cache warmup, etc.

    return true;
  } catch (error) {
    console.error('API server failed to initialize:', error);
    return false;
  }
}
