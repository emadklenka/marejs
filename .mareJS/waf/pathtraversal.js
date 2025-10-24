export function detectPathTraversal(input, req) {
  if (!input || typeof input !== "string") return false;

  // Normalize Unicode to catch homoglyph attacks (NFKC = canonical decomposition + compatibility decomposition + canonical composition)
  let normalized = input.normalize("NFKC");
  const inputLower = normalized.toLowerCase();

  // Check for protocol prefixes (case-insensitive) - file://, http://, etc.
  if (/^[a-z]+:\/\//i.test(normalized)) {
    return true;
  }

  // Decode HTML entities that could hide path traversal
  const htmlEntityPattern = /&#x?[0-9a-fA-F]+;/;
  if (htmlEntityPattern.test(normalized)) {
    return true;
  }

  // Direct path traversal sequences
  const directPatterns = ["../", "..\\", "~/", "~\\", ".../", "...\\", "..../", "....\\", "...../", ".....\\", "..//", "..\\//", "../\\", "..\\/", "....//\\\\", "..;/", "..%3b/"];

  // URL encoded patterns
  const urlEncodedPatterns = [
    "%2e%2e%2f",
    "%2e%2e/",
    "..%2f",
    "%2e%2e%5c",
    "%2e%2e\\",
    "..%5c",
    "%2e/",
    "%2e\\",
    "%2f",
    "%5c",
    "%2e%2e%2f",
    "%2E%2E%2F",
    "%2E%2E%5C",
    "%252e%252e%252f",
    "%252e%252e%255c",
    // Unicode slash variants (encoded)
    "%ef%bc%8f", // Fullwidth slash (U+FF0F)
    "%e2%81%84", // Fraction slash (U+2044)
    "%e2%88%95", // Division slash (U+2215)
    // Encoded semicolons
    "%3b/",
    "%3b\\",
    // Partial protocol encoding
    "%66ile:",
    "%46ile:", // encoded 'f' in 'file:'
    "%68ttp:",
    "%48ttp:", // encoded 'h' in 'http:'
  ];

  // Mixed encoding patterns
  const mixedPatterns = [
    "%2e./",
    ".%2e/",
    "%2e.\\",
    ".%2e\\",
    "%./",
    ".%/",
    "%5c.",
    ".%5c",
    "%%32%65",
    "%c0%ae",
    "%e0%40%ae",
    "%c0%2e",
    "%c1%9c",
    "%c1%8e",
    // IIS unicode encoding
    "%u002e",
    "%u002f",
    "%u005c",
  ];

  // Windows specific
  const windowsPatterns = ["\\\\?\\", "\\\\.\\", "\\\\", "c:", "d:", "e:", "f:", "g:", "h:", "%5c%5c", "%5c%5c%3f%5c"];

  // Unicode dot variants (homoglyphs)
  const unicodeDots = [
    "\u002e", // Regular dot
    "\uff0e", // Fullwidth full stop (．)
    "\u2024", // One dot leader (․)
    "\u2025", // Two dot leader (‥)
    "\u2026", // Horizontal ellipsis (…)
    "\u0701", // Syriac supralinear full stop
    "\u0702", // Syriac sublinear full stop
  ];

  // Unicode slash variants
  const unicodeSlashes = [
    "\u002f", // Regular forward slash
    "\uff0f", // Fullwidth solidus (／)
    "\u2044", // Fraction slash (⁄)
    "\u2215", // Division slash (∕)
    "\u29f8", // Big solidus
    "\u005c", // Backslash
    "\uff3c", // Fullwidth reverse solidus (＼)
  ];

  // Check direct patterns
  for (const pattern of directPatterns) {
    if (inputLower.includes(pattern)) return true;
  }

  // Check URL encoded
  for (const pattern of urlEncodedPatterns) {
    if (inputLower.includes(pattern)) return true;
  }

  // Check mixed encoding
  for (const pattern of mixedPatterns) {
    if (inputLower.includes(pattern)) return true;
  }

  // Check Windows patterns
  for (const pattern of windowsPatterns) {
    if (inputLower.includes(pattern)) return true;
  }

  // Check for Unicode dot variants followed by slashes (including unicode slashes)
  for (const dot of unicodeDots) {
    for (const slash of unicodeSlashes) {
      // Check for .. patterns (always dangerous)
      if (normalized.includes(dot + dot + slash)) {
        return true;
      }
      // Check for single dot patterns ONLY if it's NOT a legitimate relative path prefix
      // Allow ./path at the start, but block suspicious patterns like /./path or path/./file
      const singleDotSlash = dot + slash;
      const indices = [];
      let idx = normalized.indexOf(singleDotSlash);
      while (idx !== -1) {
        indices.push(idx);
        idx = normalized.indexOf(singleDotSlash, idx + 1);
      }

      for (const index of indices) {
        // Allow if it's at the very beginning (legitimate relative path like ./file.txt)
        if (index === 0) continue;

        // Block if it appears anywhere else (like path/./file or /./etc)
        return true;
      }
    }
  }

  // Check for dots followed by spaces and slashes (Windows quirk: ".. /" or ". \")
  // But allow legitimate ./ at the start (no space)
  if (/\.\s+[\/\\]/i.test(normalized)) {
    return true;
  }

  // Check for Windows trailing dot (C:\Windows.\System32)
  if (/[a-zA-Z]:[\/\\].*\.[\/\\]/i.test(normalized)) {
    return true;
  }

  // Multi-level decoding (up to 4 levels to catch deeply nested encodings)
  try {
    let decoded = normalized;
    for (let i = 0; i < 4; i++) {
      const prevDecoded = decoded;
      try {
        decoded = decodeURIComponent(decoded);
      } catch {
        // If decoding fails, try to continue with partial decode
        break;
      }

      // Stop if no change (fully decoded)
      if (decoded === prevDecoded) break;

      const decodedLower = decoded.toLowerCase();

      // Check all patterns on decoded content
      for (const pattern of directPatterns) {
        if (decodedLower.includes(pattern)) return true;
      }

      // Check unicode variants in decoded content
      for (const dot of unicodeDots) {
        for (const slash of unicodeSlashes) {
          // Always block .. patterns
          if (decoded.includes(dot + dot + slash)) {
            return true;
          }
          // For single dot, only block if NOT at the beginning
          const singleDotSlash = dot + slash;
          const idx = decoded.indexOf(singleDotSlash);
          if (idx !== -1 && idx !== 0) {
            return true;
          }
        }
      }

      // Check for protocol after decoding
      if (/^[a-z]+:\/\//i.test(decoded)) {
        return true;
      }
    }
  } catch (e) {
    // If any error during decoding, treat as suspicious
    return true;
  }

  // Null byte injection (various forms)
  if (normalized.includes("\0") || inputLower.includes("%00") || inputLower.includes("\\0") || inputLower.includes("%c0%80")) {
    return true;
  }

  // Absolute paths (Windows drive letters, including with trailing dots)
  if (/^[a-zA-Z]:[\\/]/i.test(normalized)) {
    return true;
  }

  // UNC paths
  if (normalized.startsWith("\\\\") || normalized.startsWith("//")) {
    return true;
  }

  // Suspicious repeating dots with any form of separator
  if (/\.{2,}/i.test(normalized) && /[\/\\]/i.test(normalized)) {
    return true;
  }

  // Check for path traversal in query strings or fragments
  if (/[?&#].*\.\.[\/\\]/i.test(normalized)) {
    return true;
  }

  // Standalone ".." without immediate slash (could be dangerous when concatenated)
  if (/\.\.[^\/\\]*$/i.test(normalized) && normalized.length > 2) {
    // Allow safe cases like "file.." or "version2.0"
    if (!/^[a-zA-Z0-9_-]+\.{1,2}[a-zA-Z0-9]*$/i.test(normalized)) {
      return true;
    }
  }

  return false;
}

// Test cases - attempts to bypass
// const testCases = [
//   // Should PASS (return true) - malicious
//   { input: "../etc/passwd", expected: true, desc: "Basic traversal" },
//   { input: "..%2fetc", expected: true, desc: "URL encoded slash" },
//   { input: "..%c0%af", expected: true, desc: "Overlong UTF-8 slash" },
//   { input: "..%ef%bc%8f", expected: true, desc: "Fullwidth slash" },
//   { input: "..%25%32%66", expected: true, desc: "Double encoded slash %2f" },
//   { input: "..%25%35%63", expected: true, desc: "Double encoded backslash %5c" },
//   { input: "....//etc", expected: true, desc: "Multiple dots with slash" },
//   { input: "..;/etc", expected: true, desc: "Semicolon separator" },
//   { input: "..%00/etc", expected: true, desc: "Null byte injection" },
//   { input: "C:/Windows", expected: true, desc: "Windows absolute path" },
//   { input: "//etc/passwd", expected: true, desc: "UNC-like path" },
//   { input: "..\\windows", expected: true, desc: "Windows backslash" },
//   { input: "%2e%2e%2f", expected: true, desc: "Fully encoded ../" },
//   { input: "..%252fetc", expected: true, desc: "Triple encoded slash" },
//   { input: ".%2e/etc", expected: true, desc: "Mixed encoding" },
//   { input: "..%c0%aeetc", expected: true, desc: "Overlong dot encoding" },
//   { input: "...//etc", expected: true, desc: "Three dots double slash" },
//   { input: "....\\etc", expected: true, desc: "Four dots double backslash" },
//   { input: "%2e%2e%5c", expected: true, desc: "Encoded ..\\" },
//   { input: "file/../../../etc", expected: true, desc: "Multiple traversals" },
//   { input: "..%e2%81%84", expected: true, desc: "Fraction slash U+2044" },
//   { input: "..%e2%88%95", expected: true, desc: "Division slash U+2215" },
//   { input: "..%c1%9c", expected: true, desc: "Overlong backslash" },
//   { input: "..%c0%80", expected: true, desc: "Overlong null byte" },
//   { input: "..%c1%81", expected: true, desc: "Overlong encoding attempt" },
//   { input: "..\\x2f", expected: true, desc: "Hex escape slash" },
//   { input: "..\\u002f", expected: true, desc: "Unicode escape slash" },
//   { input: "..\u002f", expected: true, desc: "Actual unicode slash" },
//   { input: "..\u2044", expected: true, desc: "Actual fraction slash" },
//   { input: "..\uff0f", expected: true, desc: "Actual fullwidth slash" },
//   { input: "..%u002f", expected: true, desc: "IIS %u encoding" },
//   { input: "..%u2215", expected: true, desc: "IIS unicode division slash" },
//   { input: "file://etc/passwd", expected: true, desc: "File protocol" },
//   { input: "file:///etc/passwd", expected: true, desc: "File protocol absolute" },

//   // NEW: Bypass attempts identified in audit
//   { input: "\u002e\u002e\u002fetc", expected: true, desc: "Unicode escaped ../" },
//   { input: "&#46;&#46;/etc/passwd", expected: true, desc: "HTML entity encoding dots" },
//   { input: "&#46;&#46;&#47;etc", expected: true, desc: "HTML entity dots and slash" },
//   { input: "..%c1%8e/", expected: true, desc: "Incomplete overlong UTF-8" },
//   { input: "\u2025/etc/passwd", expected: true, desc: "Two dot leader U+2025" },
//   { input: "\uff0e\uff0e/etc", expected: true, desc: "Fullwidth dots" },
//   { input: "FILE:///etc/passwd", expected: true, desc: "Uppercase FILE protocol" },
//   { input: "%66ile:///etc/passwd", expected: true, desc: 'Encoded "file" protocol' },
//   { input: "C:\\Windows.\\System32", expected: true, desc: "Windows trailing dot" },
//   { input: "..%3b/etc/passwd", expected: true, desc: "Encoded semicolon" },
//   { input: "/download?file=../../etc/passwd", expected: true, desc: "Path traversal in query" },
//   { input: ".. /etc/passwd", expected: true, desc: "Dot-space-slash" },
//   { input: ". /etc/passwd", expected: true, desc: "Single dot-space-slash" },
//   { input: "\u2024\u2024/etc", expected: true, desc: "One dot leader doubled" },
//   { input: "\u2026/etc", expected: true, desc: "Ellipsis character" },
//   { input: "..%252fetc", expected: true, desc: "Partial double encoding" },
//   { input: "\uff3c\uff3cetc", expected: true, desc: "Fullwidth backslashes" },
//   { input: "http://evil.com/../../etc", expected: true, desc: "HTTP protocol with traversal" },
//   { input: "d:/windows/system32", expected: true, desc: "D: drive path" },
//   { input: "%48ttp://evil.com", expected: true, desc: "Encoded http protocol" },

//   // Should FAIL (return false) - safe
//   { input: "file.txt", expected: false, desc: "Simple filename" },
//   { input: "my.file.name.txt", expected: false, desc: "Filename with dots" },
//   { input: "folder/file.txt", expected: false, desc: "Normal path" },
//   { input: "", expected: false, desc: "Empty string" },
//   { input: "version2.0", expected: false, desc: "Version number" },
//   { input: "user_file.txt", expected: false, desc: "Underscore filename" },
//   { input: "data-2024.json", expected: false, desc: "Dash filename" },
//   { input: "./assets/logo.png", expected: false, desc: "Relative path with dot-slash" },
//   { input: "./components/Button.js", expected: false, desc: "Relative component path" },
//   { input: "./config.json", expected: false, desc: "Relative config file" },
//   { input: "file%2Ename.txt", expected: false, desc: "Encoded dot in filename" },
//   { input: "document%2Epdf", expected: false, desc: "Encoded dot in PDF filename" },
//   { input: "/api/download?filename=report.v2.0.pdf", expected: false, desc: "API query with version number" },
//   { input: "/search?q=version2.0", expected: false, desc: "Search query parameter" },
// ];

// console.log("Testing Path Traversal Detection\n");
// console.log("=".repeat(80));

// let passed = 0;
// let failed = 0;
// const failures = [];

// testCases.forEach((test, idx) => {
//   const result = detectPathTraversal(test.input);
//   const success = result === test.expected;

//   if (success) {
//     passed++;
//     console.log(`✓ Test ${idx + 1}: ${test.desc}`);
//   } else {
//     failed++;
//     console.log(`✗ Test ${idx + 1}: ${test.desc}`);
//     console.log(`  Input: "${test.input}"`);
//     console.log(`  Expected: ${test.expected}, Got: ${result}`);
//     failures.push(test);
//   }
// });

// console.log("\n" + "=".repeat(80));
// console.log(`Results: ${passed} passed, ${failed} failed`);

// if (failures.length > 0) {
//   console.log("\n⚠️  VULNERABILITIES FOUND:");
//   failures.forEach((f) => {
//     console.log(`  - ${f.desc}: "${f.input}"`);
//   });
// }
