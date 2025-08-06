 /**
  * MareJS middleware function
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  * @param {Function} next - Express next middleware function
  */
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

/**
 * MareJS middleware function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function mareMiddleware(req, res, next) {
  // Security headers
  helmet({
    contentSecurityPolicy: false, // Set to true and configure CSP for production
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })(req, res, () => {
    // Prevent HTTP Parameter Pollution
    hpp()(req, res, () => {
      next();
    });
  });
}

// Global rate limiter (to be used in main server file)
export const mareRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});
 