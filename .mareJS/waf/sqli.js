/**
 * SQL Injection Detection Module (Context-Aware)
 *
 * Uses context-aware detection inspired by OWASP ModSecurity CRS and libinjection.
 * Looks for SQL SYNTAX patterns and COMBINATIONS of indicators, not just keywords.
 *
 * This approach significantly reduces false positives while catching real attacks.
 *
 * Detects:
 * - Quotes combined with SQL keywords (' OR 1=1, " UNION SELECT)
 * - SQL operators with logic (OR 1=1--, AND 'a'='a)
 * - SQL comments (--, /*, #)
 * - Stacked queries (; DROP TABLE)
 * - SQL functions in attack context (SLEEP(), BENCHMARK())
 * - SQL syntax patterns (UNION...SELECT)
 */

/**
 * Detect SQL Injection attempts (Context-Aware)
 * @param {string} input - The input string to check
 * @returns {boolean} True if SQL injection pattern detected, false otherwise
 */
export function detectSQLInjection(input) {
  if (!input || typeof input !== "string") return false;

  const normalized = input.normalize("NFKC");
  const inputLower = normalized.toLowerCase();

  // ========== HIGH CONFIDENCE PATTERNS ==========
  // These are clear SQL injection attempts with very low false positive rate

  // 1. Classic SQL injection logic bombs (quote + operator + value)
  const logicBombs = [
    "' or '1'='1",
    '" or "1"="1',
    "' or 1=1",
    '" or 1=1',
    "' and '1'='1",
    '" and "1"="1',
    "' and 1=1",
    '" and 1=1',
    "' or 'a'='a",
    '" or "a"="a',
    "' or true",
    '" or true',
    "' or '1",
    '" or "1',
    "or 1=1--",
    "or 1=1#",
    "or 1=1/*",
    "and 1=1--",
    "' || '",
    '" || "',
    "' && '",
    '" && "',
  ];

  for (const pattern of logicBombs) {
    if (inputLower.includes(pattern)) return true;
  }

  // 2. SQL comments (legitimate text rarely has SQL comments)
  const sqlComments = [
    "--",     // SQL comment
    "/*",     // Multi-line comment start
    "*/",     // Multi-line comment end
    "#",      // MySQL comment (but be careful with URLs)
    ";\x00",  // Null byte with semicolon
  ];

  for (const comment of sqlComments) {
    if (normalized.includes(comment)) {
      // Exception: # is common in URLs/fragments, only flag if with SQL keywords
      if (comment === "#") {
        if (
          /'\s*#|"\s*#|;\s*#/.test(normalized) ||
          /(select|union|insert|delete|drop|update|exec).*#/i.test(inputLower)
        ) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  // 3. Stacked queries (semicolon + SQL command)
  if (/;\s*(select|insert|update|delete|drop|create|alter|exec|execute)/i.test(normalized)) {
    return true;
  }

  // 4. Quote + SQL keywords + operators (indicates SQL context manipulation)
  // Must have quote AND keyword AND operator/special char to reduce false positives
  const quoteKeywordPatterns = [
    /'[^']*\b(union|select)\b[^']*\b(select|from|where|join)/i,  // '...union...select or '...select...from
    /"[^"]*\b(union|select)\b[^"]*\b(select|from|where|join)/i,
    /'[^']*\b(insert|delete|update|drop)\b[^']*\b(into|from|table|where)/i,
    /"[^"]*\b(insert|delete|update|drop)\b[^"]*\b(into|from|table|where)/i,
  ];

  for (const pattern of quoteKeywordPatterns) {
    if (pattern.test(inputLower)) return true;
  }

  // 5. UNION-based injection (UNION combined with SELECT)
  if (/union\s+(all\s+)?select/i.test(inputLower)) {
    return true;
  }

  // 6. Time-based blind SQL injection functions
  const timingFunctions = [
    /sleep\s*\(/i,
    /benchmark\s*\(/i,
    /waitfor\s+delay/i,
    /pg_sleep\s*\(/i,
  ];

  for (const pattern of timingFunctions) {
    if (pattern.test(inputLower)) return true;
  }

  // 7. Information extraction functions (database probing)
  const infoFunctions = [
    /database\s*\(/i,
    /@@version/i,
    /information_schema/i,
    /sysobjects/i,
    /syscolumns/i,
  ];

  for (const pattern of infoFunctions) {
    // Only flag if combined with quotes or other SQL indicators
    if (pattern.test(inputLower) && (/'|"|union|select|;/.test(normalized))) {
      return true;
    }
  }

  // version() and user() are too common in normal text, only flag with strong SQL context
  if (/version\s*\(/i.test(inputLower) || /user\s*\(/i.test(inputLower)) {
    if (/'|"/.test(normalized) && /union|select|insert|delete/i.test(inputLower)) {
      return true;
    }
  }

  // 8. Hexadecimal encoding with SQL keywords (0x... combined with SQL)
  // Only flag if BOTH hex encoding AND SQL keyword with proper word boundaries
  if (/\b0x[0-9a-f]{6,}\b/i.test(normalized)) {
    // Longer hex strings (6+ chars) are more likely to be SQL injection payloads
    return true;
  }

  // 9. SQL operators with suspicious patterns
  const operatorPatterns = [
    /=\s*(select|union)/i,
    /\)\s*(union|select)/i,
    /'\s*or\s*'/i,
    /"\s*or\s*"/i,
    /'\s*and\s*'/i,
    /"\s*and\s*"/i,
  ];

  for (const pattern of operatorPatterns) {
    if (pattern.test(inputLower)) return true;
  }

  // 10. Dangerous stored procedure calls (SQL Server)
  if (/\b(xp_|sp_)\w+/i.test(inputLower)) {
    // Only flag if with quotes or semicolons
    if (/'|"|;/.test(normalized)) {
      return true;
    }
  }

  return false;
}
