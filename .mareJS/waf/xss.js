/**
 * XSS (Cross-Site Scripting) Detection Module
 * Detects various XSS attack patterns including:
 * - HTML tags (<script>, <iframe>, <object>, etc.)
 * - Event handlers (onload, onerror, onclick, etc.)
 * - JavaScript protocols (javascript:, data:text/html, etc.)
 * - Encoded variants (URL encoding, HTML entities, Unicode escapes)
 * - Attribute injection patterns
 */

/**
 * Detect XSS (Cross-Site Scripting) attempts
 * @param {string} input - The input string to check
 * @returns {boolean} True if XSS pattern detected, false otherwise
 */
export function detectXSS(input) {
  if (!input || typeof input !== "string") return false;

  const normalized = input.normalize("NFKC").toLowerCase();

  // Dangerous HTML tags
  const dangerousTags = [
    "<script",
    "</script",
    "<iframe",
    "<object",
    "<embed",
    "<applet",
    "<meta",
    "<link",
    "<style",
    "<svg",
    "<math",
    "<form",
    "<input",
    "<button",
    "<textarea",
    "<base",
    "<img",
    "<video",
    "<audio",
    "<source",
    "<track",
  ];

  // Event handlers
  const eventHandlers = [
    "onload=",
    "onerror=",
    "onclick=",
    "onmouseover=",
    "onmouseout=",
    "onmousemove=",
    "onmouseenter=",
    "onmouseleave=",
    "onfocus=",
    "onblur=",
    "onchange=",
    "onsubmit=",
    "onkeydown=",
    "onkeyup=",
    "onkeypress=",
    "ondblclick=",
    "oncontextmenu=",
    "oninput=",
    "onwheel=",
    "ondrag=",
    "ondrop=",
    "onanimationend=",
    "ontransitionend=",
  ];

  // JavaScript protocols
  const jsProtocols = [
    "javascript:",
    "data:text/html",
    "vbscript:",
    "data:application/",
  ];

  // Check dangerous tags
  for (const tag of dangerousTags) {
    if (normalized.includes(tag)) return true;
  }

  // Check event handlers
  for (const handler of eventHandlers) {
    if (normalized.includes(handler)) return true;
  }

  // Check JavaScript protocols
  for (const protocol of jsProtocols) {
    if (normalized.includes(protocol)) return true;
  }

  // Check for encoded versions (URL encoding)
  const encodedPatterns = [
    "%3cscript", // <script
    "%3c%73%63%72%69%70%74", // <script full
    "&#60;script", // &#60; = <
    "&#x3c;script",
    "&lt;script",
    "\\u003cscript", // Unicode escape
    "\\x3cscript", // Hex escape
    "%6a%61%76%61%73%63%72%69%70%74", // javascript
    "&#106;&#97;&#118;&#97;", // javascript (decimal entities)
  ];

  for (const pattern of encodedPatterns) {
    if (normalized.includes(pattern)) return true;
  }

  // Attribute injection patterns
  const attributeInjection = [
    '"><script',
    "'>script",
    '" onload="',
    "' onload='",
    '" onerror="',
    "' onerror='",
    '"/><script',
    "'/><script",
  ];

  for (const pattern of attributeInjection) {
    if (normalized.includes(pattern)) return true;
  }

  // SVG/XML event handlers
  if (normalized.includes("<svg") && normalized.includes("onload")) return true;
  if (normalized.includes("<svg") && normalized.includes("onerror")) return true;

  // Expression/behavior (IE-specific but still check)
  if (normalized.includes("expression(")) return true;
  if (normalized.includes("-moz-binding")) return true;

  return false;
}
