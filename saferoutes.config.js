/**
 * ⚠️  SECURITY WARNING ⚠️
 *
 * This file configures routes that bypass WAF (Web Application Firewall) checks.
 * Only add routes here if you fully understand the security implications!
 *
 * Use cases:
 * - External webhooks (GitHub, Stripe) that send special characters
 * - Code editors that legitimately accept <script> tags
 * - Internal admin tools already protected by other authentication
 *
 * Each bypass is LOGGED, so monitor your logs for abuse.
 *
 * Environment variables:
 * - WAF_SAFE_ROUTES=false : Disables this config file entirely
 * - WAF_STRICT=true : Ignores this config and checks everything
 */

export default {
  /**
   * EXACT MATCHES - Complete WAF bypass for these exact paths
   * Example: "/api/public/webhooks/github"
   */
  exact: [
    // "/api/public/webhooks/github",
    // "/api/public/webhooks/stripe",
  ],

  /**
   * PATTERN MATCHES - Use wildcards (*) to match multiple routes
   * Example: "/api/public/webhooks/*" matches all webhook routes
   */
  patterns: [
    // "/api/public/webhooks/*",
  ],

  /**
   * PARTIAL BYPASSES - Disable specific WAF checks for certain routes
   * Allows you to skip only XSS, SQL injection, or path traversal checks
   */
  partial: [
    // Example: Blog posts can contain HTML (disable XSS check only)
    // {
    //   path: "/api/blog/post",
    //   methods: ["POST", "PUT"],  // Optional: only for these HTTP methods
    //   skip: ["xss"],  // Options: "xss", "sqli", "pathtraversal"
    //   reason: "Blog posts contain legitimate HTML content"
    // },

    // Example: Code snippet endpoint accepts SQL/JS code
    // {
    //   path: "/api/code/snippet",
    //   skip: ["xss", "sqli"],
    //   reason: "Code examples contain SQL and JavaScript syntax"
    // },
  ],
};
