/**
 * XSS (Cross-Site Scripting) Detection Module - PERMISSIVE MODE
 *
 * PHILOSOPHY: Block CODE EXECUTION, not HTML presence
 *
 * This module focuses on actual XSS attack vectors that can execute code:
 * - <script> tags (the primary execution vector)
 * - Event handlers in tag context (onload, onerror, etc.)
 * - JavaScript protocols (javascript:, data:text/html, vbscript:)
 * - Encoded variants of the above
 * - Dangerous CSS expressions
 *
 * ALLOWS:
 * - Safe HTML tags: <b>, <img>, <iframe>, <form>, etc. (without dangerous attributes)
 * - Mentions of event handlers in text: "Set onload=true" (not in tag context)
 * - Code tutorials: "The <script> tag is used for..." (plain text)
 *
 * BLOCKS:
 * - Actual <script> tags with content
 * - Event handlers IN tag context: <div onload="...">
 * - JavaScript execution protocols
 */

/**
 * Detect XSS (Cross-Site Scripting) attempts - Execution-focused
 * @param {string} input - The input string to check
 * @returns {boolean} True if XSS pattern detected, false otherwise
 */
export function detectXSS(input) {
  if (!input || typeof input !== "string") return false;

  const normalized = input.normalize("NFKC").toLowerCase();

  // ========== PRIMARY THREAT: <script> tags ==========
  // Block <script> in all forms and encodings
  const scriptPatterns = [
    "<script",           // Direct
    "</script",          // Closing tag
    "%3cscript",         // URL encoded <
    "%3c%73%63%72%69%70%74", // Fully encoded
    "&#60;script",       // HTML entity &#60; = <
    "&#x3c;script",      // Hex entity
    "&lt;script",        // Named entity
    "\\u003cscript",     // Unicode escape
    "\\x3cscript",       // Hex escape
    "\u003cscript",      // Actual Unicode
  ];

  for (const pattern of scriptPatterns) {
    if (normalized.includes(pattern)) return true;
  }

  // ========== JAVASCRIPT PROTOCOLS (Execution vectors) ==========
  const jsProtocols = [
    "javascript:",
    "data:text/html",
    "vbscript:",
    "data:application/",
    "%6a%61%76%61%73%63%72%69%70%74",  // Encoded "javascript"
    "&#106;&#97;&#118;&#97;",           // Entity encoded "java"
  ];

  for (const protocol of jsProtocols) {
    if (normalized.includes(protocol)) return true;
  }

  // ========== EVENT HANDLERS IN TAG CONTEXT ==========
  // Only block if event handler appears to be in a tag (has opening bracket before it)
  // This allows "Set onload=true in config" but blocks "<div onload="

  const eventHandlers = [
    "onload", "onerror", "onclick", "onmouseover", "onmouseout",
    "onmousemove", "onmouseenter", "onmouseleave", "onfocus",
    "onblur", "onchange", "onsubmit", "onkeydown", "onkeyup",
    "onkeypress", "ondblclick", "oncontextmenu", "oninput",
    "onwheel", "ondrag", "ondrop", "onanimationend", "ontransitionend",
    "onanimationstart", "ontransitionstart", "onloadstart", "onprogress",
  ];

  for (const handler of eventHandlers) {
    // Check if event handler is in tag context: <...handler= or <... handler=
    // Use regex to detect: < followed by anything, then the handler with =
    const tagContextPattern = new RegExp(`<[^>]*\\s${handler}\\s*=`, "i");
    if (tagContextPattern.test(normalized)) return true;

    // Check for attribute injection: "handler= or 'handler=
    const attrInjectionPattern = new RegExp(`['"][^'"]*\\s${handler}\\s*=`, "i");
    if (attrInjectionPattern.test(normalized)) return true;
  }

  // ========== ATTRIBUTE INJECTION PATTERNS ==========
  // Breaking out of attributes to inject scripts
  const attributeInjection = [
    '"><script',
    "'><script",
    '"/><script',
    "'/><script",
    '"><svg',
    "'><svg",
  ];

  for (const pattern of attributeInjection) {
    if (normalized.includes(pattern)) return true;
  }

  // ========== SVG/XML EVENT HANDLERS ==========
  // SVG elements can execute JavaScript via onload
  // Only block if SVG has event handlers
  if (normalized.includes("<svg")) {
    for (const handler of ["onload", "onerror", "onclick"]) {
      // Check if handler appears after <svg
      const svgIndex = normalized.indexOf("<svg");
      const handlerIndex = normalized.indexOf(handler, svgIndex);
      if (handlerIndex > svgIndex && handlerIndex < svgIndex + 100) {
        // Handler is within 100 chars of <svg opening - likely in tag
        return true;
      }
    }
  }

  // ========== CSS EXPRESSION / BEHAVIOR ==========
  // IE-specific XSS vectors (still check for legacy systems)
  if (normalized.includes("expression(")) return true;
  if (normalized.includes("-moz-binding")) return true;

  // ========== DANGEROUS ATTRIBUTES ==========
  // Attributes that can execute code
  const dangerousAttributes = [
    "srcdoc=",       // iframe srcdoc can contain scripts
    "formaction=",   // Can redirect form submission
  ];

  for (const attr of dangerousAttributes) {
    // Only flag if it contains javascript: or data:
    const attrIndex = normalized.indexOf(attr);
    if (attrIndex !== -1) {
      const afterAttr = normalized.substring(attrIndex, attrIndex + 100);
      if (afterAttr.includes("javascript:") || afterAttr.includes("data:")) {
        return true;
      }
    }
  }

  return false;
}
