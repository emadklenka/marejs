/**
 * Path Traversal Detection Module - PERMISSIVE MODE
 *
 * PHILOSOPHY: Block TRAVERSAL patterns (../), not legitimate web patterns
 *
 * FOCUSES ON:
 * - Directory traversal: ../ and all encoded variants
 * - Dangerous protocols: file://, but NOT http:// or https://
 * - Windows absolute paths with slashes: C:\Windows (not "C: drive" in text)
 * - UNC paths: \\server\share
 * - Null byte injection
 *
 * ALLOWS:
 * - Legitimate URLs: http://, https://
 * - Protocol-relative URLs: //cdn.example.com
 * - HTML entities: &gt;, &amp;, etc.
 * - URL-encoded legitimate paths: https%3A%2F%2Fexample.com
 * - Relative paths: ./file.txt
 * - Mentions in text: "Save to C: drive", "Use // for comments"
 * - URL encoded slashes in legitimate contexts
 *
 * BLOCKS:
 * - Actual directory traversal: ../
 * - Encoded traversal: %2e%2e%2f, ..%2f, etc.
 * - file:// protocol
 * - Windows absolute paths: C:\Windows
 * - UNC paths: \\server\share
 */

export function detectPathTraversal(input, req) {
  if (!input || typeof input !== "string") return false;

  // Normalize Unicode to catch homoglyph attacks
  let normalized = input.normalize("NFKC");
  const inputLower = normalized.toLowerCase();

  // ========== ALLOW SAFE PROTOCOLS ==========
  // Allow http://, https://, ws://, wss://
  // BLOCK file://, ftp://, and other dangerous protocols
  const protocolMatch = inputLower.match(/^([a-z]+):\/\//);
  if (protocolMatch) {
    const protocol = protocolMatch[1];
    const allowedProtocols = ["http", "https", "ws", "wss"];
    if (!allowedProtocols.includes(protocol)) {
      // Block: file://, ftp://, etc.
      return true;
    }
    // Allow http:// and https:// - these are safe
    return false;
  }

  // ========== ALLOW PROTOCOL-RELATIVE URLs ==========
  // Allow: //cdn.example.com/script.js
  // Block: \\server\share (Windows UNC path)
  if (normalized.startsWith("//")) {
    // Check if it looks like a legitimate URL (has domain-like structure)
    // Legitimate: //cdn.example.com, //ajax.googleapis.com
    // Malicious: ///../etc/passwd, //\\server
    if (/^\/\/[a-z0-9][-a-z0-9.]*[a-z0-9]/i.test(normalized)) {
      // Make sure it doesn't have traversal after the domain
      if (!normalized.includes("..")) {
        return false; // Safe protocol-relative URL
      }
    }
  }

  // ========== ALLOW SAFE HTML ENTITIES ==========
  // Common HTML entities: &gt; &lt; &amp; &quot; &nbsp;
  // Only block if they're encoding traversal patterns
  const safeEntities = ["&gt;", "&lt;", "&amp;", "&quot;", "&nbsp;", "&apos;", "&cent;", "&pound;", "&yen;", "&euro;", "&copy;", "&reg;"];
  let hasSafeEntitiesOnly = false;

  for (const entity of safeEntities) {
    if (inputLower.includes(entity)) {
      hasSafeEntitiesOnly = true;
    }
  }

  // If it has HTML entities, check if they're hiding traversal
  const htmlEntityPattern = /&#x?[0-9a-fA-F]+;/;
  if (htmlEntityPattern.test(normalized)) {
    // Decode numeric entities and check if they're hiding traversal patterns
    let decoded = normalized
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );

    // Only flag if decoded content has traversal patterns
    if (decoded.includes("..") || decoded.includes("\\\\")) {
      return true; // HTML entities hiding traversal
    }
    // Otherwise allow - it's just formatting
    return false;
  }

  // If only safe named entities, allow them
  if (hasSafeEntitiesOnly && !normalized.includes("..")) {
    return false;
  }

  // ========== BLOCK UNC PATHS ==========
  // Windows UNC paths: \\server\share or %5c%5cserver
  if (normalized.startsWith("\\\\") || inputLower.startsWith("%5c%5c")) {
    return true;
  }

  // ========== BLOCK WINDOWS ABSOLUTE PATHS ==========
  // Block: C:\Windows\System32, D:/files/secret.txt
  // Allow: "Save to C: drive" (no slash after)
  if (/^[a-z]:[\\\/]/i.test(normalized)) {
    return true; // Windows absolute path with slash
  }

  // ========== BLOCK NULL BYTES ==========
  // Null byte injection: %00, \0, %c0%80
  if (
    normalized.includes("\0") ||
    inputLower.includes("%00") ||
    inputLower.includes("\\0") ||
    inputLower.includes("%c0%80")
  ) {
    return true;
  }

  // ========== BLOCK DIRECTORY TRAVERSAL PATTERNS ==========
  // Core danger: ../ and variants
  const traversalPatterns = [
    "../",              // Basic forward
    "..\\",             // Basic backward
    ".../",             // Triple dot forward
    "...\\",            // Triple dot backward
    "..../",            // Quad dot
    "....\\",
    "..//",             // Double slash
    "..\\//",
    "../\\",
    "..\\/",
    "..;/",             // Semicolon separator
    "~/",               // Unix home directory
    "~\\",
  ];

  for (const pattern of traversalPatterns) {
    if (inputLower.includes(pattern)) {
      return true;
    }
  }

  // ========== BLOCK ENCODED TRAVERSAL ==========
  // URL-encoded directory traversal
  const encodedTraversal = [
    "%2e%2e%2f",        // Fully encoded ../
    "%2e%2e/",          // Partially encoded
    "..%2f",            // Encoded slash
    "%2e%2e%5c",        // Encoded backslash
    "%2e%2e\\",
    "..%5c",
    "%2E%2E%2F",        // Uppercase
    "%2E%2E%5C",
    "%252e%252e%252f",  // Double-encoded
    "%252e%252e%255c",
    ".%2e/",            // Mixed encoding
    "%2e./",
    ".%2e\\",
    "%2e.\\",
    // Overlong UTF-8 encoding
    "%c0%ae",           // Overlong dot
    "%e0%40%ae",
    "%c0%2e",
    "%c1%9c",           // Overlong backslash
    "%c1%8e",
    // IIS unicode encoding
    "%u002e%u002e",     // Unicode dots
  ];

  for (const pattern of encodedTraversal) {
    if (inputLower.includes(pattern)) {
      return true;
    }
  }

  // ========== BLOCK ENCODED DANGEROUS PROTOCOLS ==========
  // Attempts to encode file:// protocol
  const encodedProtocols = [
    "%66ile:",          // Encoded 'f' in 'file:'
    "%46ile:",
    "file%3a",          // Encoded colon
    "%66%69%6c%65",     // Fully encoded 'file'
  ];

  for (const pattern of encodedProtocols) {
    if (inputLower.includes(pattern)) {
      return true;
    }
  }

  // ========== BLOCK UNICODE HOMOGLYPH TRAVERSAL ==========
  // Unicode variants of dots and slashes used for traversal
  const unicodeDots = [
    "\uff0e",           // Fullwidth full stop (．)
    "\u2024",           // One dot leader (․)
    "\u2025",           // Two dot leader (‥)
    "\u2026",           // Horizontal ellipsis (…)
  ];

  const unicodeSlashes = [
    "\uff0f",           // Fullwidth solidus (／)
    "\u2044",           // Fraction slash (⁄)
    "\u2215",           // Division slash (∕)
    "\uff3c",           // Fullwidth reverse solidus (＼)
  ];

  // Check for unicode dot-dot-slash patterns
  for (const dot of unicodeDots) {
    for (const slash of unicodeSlashes) {
      // Check for .. patterns (always dangerous)
      if (normalized.includes(dot + dot + slash)) {
        return true;
      }
      // Also check combinations with regular dots
      if (normalized.includes(".." + slash) || normalized.includes(dot + "." + slash)) {
        return true;
      }
    }
  }

  // ========== MULTI-LEVEL URL DECODING ==========
  // Catch deeply nested encodings (e.g., %252e = % encoded as %25)
  try {
    let decoded = normalized;
    for (let i = 0; i < 3; i++) {
      const prevDecoded = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch {
        break; // If decoding fails, stop
      }

      // Stop if no change (fully decoded)
      if (decoded === prevDecoded) break;

      const decodedLower = decoded.toLowerCase();

      // Check for traversal patterns in decoded content
      for (const pattern of traversalPatterns) {
        if (decodedLower.includes(pattern)) {
          return true;
        }
      }

      // Check for unicode traversal in decoded content
      for (const dot of unicodeDots) {
        for (const slash of unicodeSlashes) {
          if (decoded.includes(dot + dot + slash)) {
            return true;
          }
        }
      }

      // Check for dangerous protocols after decoding
      if (/^(file|ftp):\/\//i.test(decoded)) {
        return true;
      }
    }
  } catch (e) {
    // If any error during decoding, treat as suspicious
    return true;
  }

  // ========== BLOCK SUSPICIOUS DOT PATTERNS ==========
  // Repeating dots with separators are suspicious
  // But allow legitimate cases like file.txt, version2.0.1
  if (/\.{2,}/.test(normalized)) {
    // Has multiple dots - check if they're dangerous
    if (/\.{2,}[\/\\]/i.test(normalized)) {
      // Multiple dots followed by slash = traversal
      return true;
    }
  }

  // All checks passed - input is safe
  return false;
}
