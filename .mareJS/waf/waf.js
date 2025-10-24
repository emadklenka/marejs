/**
 * WAF (Web Application Firewall) Middleware
 * Main orchestrator for security checks against:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - Path Traversal
 */

import { detectPathTraversal } from "./pathtraversal.js";
import { detectXSS } from "./xss.js";
import { detectSQLInjection } from "./sqli.js";
import { getSafeRoutes } from "../mare_server.js";

/**
 * Scan a single value against all detection functions
 */
function scanValue(value, key, checks) {
  const results = [];

  if (typeof value !== "string") return results;

  // Path Traversal
  if (checks.includes("pathtraversal") && detectPathTraversal(value)) {
    results.push({ type: "Path Traversal", key, value });
  }

  // XSS
  if (checks.includes("xss") && detectXSS(value)) {
    results.push({ type: "XSS", key, value });
  }

  // SQL Injection
  if (checks.includes("sqli") && detectSQLInjection(value)) {
    results.push({ type: "SQL Injection", key, value });
  }

  return results;
}

/**
 * Recursively scan object/array for malicious content
 */
function scanObject(obj, prefix = "", checks = ["pathtraversal", "xss", "sqli"], depth = 0, maxDepth = 10) {
  const results = [];

  if (depth > maxDepth) return results; // Prevent deep recursion attacks

  if (typeof obj === "string") {
    return scanValue(obj, prefix, checks);
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = `${prefix}[${index}]`;
      results.push(...scanObject(item, key, checks, depth + 1, maxDepth));
    });
  } else if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      results.push(...scanObject(obj[key], fullKey, checks, depth + 1, maxDepth));
    });
  }

  return results;
}

/**
 * Check if route matches safe routes configuration
 */
function isRouteSafe(req) {
  const wafEnabled = process.env.WAF !== "false";
  const safeRoutesEnabled = process.env.WAF_SAFE_ROUTES !== "false";
  const strictMode = process.env.WAF_STRICT === "true";

  if (!wafEnabled) return { safe: true, reason: "WAF disabled" };
  if (strictMode) return { safe: false, reason: "Strict mode enabled" };
  if (!safeRoutesEnabled) return { safe: false, reason: "Safe routes disabled" };

  const routes = getSafeRoutes();
  const reqPath = req.path;
  const reqMethod = req.method;

  // Check exact matches
  if (routes.exact && routes.exact.includes(reqPath)) {
    return { safe: true, reason: `Exact match: ${reqPath}`, skipAll: true };
  }

  // Check pattern matches (simple wildcard support)
  if (routes.patterns) {
    for (const pattern of routes.patterns) {
      const regexPattern = pattern.replace(/\*/g, ".*").replace(/\//g, "\\/");
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(reqPath)) {
        return { safe: true, reason: `Pattern match: ${pattern}`, skipAll: true };
      }
    }
  }

  // Check partial matches (specific checks disabled)
  if (routes.partial) {
    for (const partial of routes.partial) {
      if (partial.path === reqPath) {
        // Check method if specified
        if (partial.methods && !partial.methods.includes(reqMethod)) {
          continue;
        }
        return {
          safe: true,
          reason: `Partial match: ${partial.path} (${partial.reason})`,
          skipChecks: partial.skip || [],
          skipAll: false,
        };
      }
    }
  }

  return { safe: false };
}

/**
 * Main WAF Middleware
 */
export function wafMiddleware(req, res, next) {
  const wafEnabled = process.env.WAF !== "false"; // Default: enabled
  const wafMode = process.env.WAF_MODE || "block"; // block | log | off

  if (!wafEnabled || wafMode === "off") {
    return next();
  }

  // Check if route is in safe routes
  const routeCheck = isRouteSafe(req);
  if (routeCheck.safe && routeCheck.skipAll) {
    console.log(`[WAF BYPASSED] ${req.path} (${routeCheck.reason})`);
    return next();
  }

  // Determine which checks to run
  let checksToRun = ["pathtraversal", "xss", "sqli"];
  if (routeCheck.safe && routeCheck.skipChecks) {
    checksToRun = checksToRun.filter((check) => !routeCheck.skipChecks.includes(check));
    if (checksToRun.length < 3) {
      console.log(
        `[WAF PARTIAL BYPASS] ${req.path} - Skipping: ${routeCheck.skipChecks.join(", ")} (${routeCheck.reason})`
      );
    }
  }

  const threats = [];

  // Scan query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    threats.push(...scanObject(req.query, "query", checksToRun));
  }

  // Scan body parameters
  if (req.body && Object.keys(req.body).length > 0) {
    threats.push(...scanObject(req.body, "body", checksToRun));
  }

  // Scan route parameters
  if (req.params && Object.keys(req.params).length > 0) {
    threats.push(...scanObject(req.params, "params", checksToRun));
  }

  // Scan uploaded file names
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    files.forEach((file, index) => {
      if (file.originalname || file.name) {
        const fileName = file.originalname || file.name;
        threats.push(...scanValue(fileName, `file[${index}].name`, checksToRun));
      }
    });
  }

  // If threats detected
  if (threats.length > 0) {
    threats.forEach((threat) => {
      const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
      const ip = req.ip || req.connection.remoteAddress || "unknown";
      console.log(
        `[WAF BLOCKED] ${timestamp} | IP: ${ip} | Path: ${req.path} | Attack: ${threat.type} | Param: ${threat.key} | Value: ${threat.value}`
      );
    });

    if (wafMode === "block") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Request blocked by Web Application Firewall",
        threats: threats.map((t) => ({ type: t.type, parameter: t.key })),
      });
    }
    // If mode is 'log', just log but allow request to continue
  }

  next();
}
