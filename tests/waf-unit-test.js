/**
 * WAF Unit Tests - Test detection functions directly
 * Tests the permissive WAF changes
 */

import { detectXSS } from '../.mareJS/waf/xss.js';
import { detectPathTraversal } from '../.mareJS/waf/pathtraversal.js';
import { detectSQLInjection } from '../.mareJS/waf/sqli.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

let passCount = 0;
let failCount = 0;

function test(description, input, detectionFn, shouldBlock) {
  const result = detectionFn(input);
  const success = result === shouldBlock;

  if (success) {
    passCount++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
  } else {
    failCount++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  Input: "${input}"`);
    console.log(`  Expected: ${shouldBlock ? 'BLOCK' : 'ALLOW'}, Got: ${result ? 'BLOCK' : 'ALLOW'}`);
  }
}

console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║         WAF Unit Tests - Permissive Mode                   ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

// ========== XSS TESTS ==========
console.log(`${colors.yellow}━━━ XSS Detection Tests ━━━${colors.reset}\n`);

// Should ALLOW (false positives we're fixing)
test('XSS: Allow safe HTML - <b>Bold</b>', 'Hello <b>World</b>', detectXSS, false);
test('XSS: Allow <img> without events', '<img src="photo.jpg">', detectXSS, false);
test('XSS: Allow <iframe> without events', '<iframe src="video.html"></iframe>', detectXSS, false);
test('XSS: Allow text mentioning onload', 'Set onload=true in config', detectXSS, false);
test('XSS: Allow code tutorial', 'The <form> tag is used for...', detectXSS, false);
test('XSS: Allow <button> without events', '<button>Click me</button>', detectXSS, false);

// Should BLOCK (actual attacks)
test('XSS: Block <script> tag', '<script>alert(1)</script>', detectXSS, true);
test('XSS: Block encoded script', '%3cscript%3ealert(1)%3c/script%3e', detectXSS, true);
test('XSS: Block javascript: protocol', 'javascript:alert(1)', detectXSS, true);
test('XSS: Block <img> WITH onerror', '<img src=x onerror=alert(1)>', detectXSS, true);
test('XSS: Block <div> WITH onload', '<div onload=alert(1)>', detectXSS, true);
test('XSS: Block data:text/html', 'data:text/html,<script>alert(1)</script>', detectXSS, true);
test('XSS: Block <svg> with onload', '<svg onload=alert(1)>', detectXSS, true);
test('XSS: Block attribute injection', '"><script>alert(1)</script>', detectXSS, true);

// ========== PATH TRAVERSAL TESTS ==========
console.log(`\n${colors.yellow}━━━ Path Traversal Detection Tests ━━━${colors.reset}\n`);

// Should ALLOW (false positives we're fixing)
test('Path: Allow http:// URL', 'http://example.com/file.pdf', detectPathTraversal, false);
test('Path: Allow https:// URL', 'https://docs.mareJS.com', detectPathTraversal, false);
test('Path: Allow protocol-relative URL', '//cdn.example.com/script.js', detectPathTraversal, false);
test('Path: Allow HTML entity &gt;', 'Price &gt; $100', detectPathTraversal, false);
test('Path: Allow encoded URL param', 'redirect=https%3A%2F%2Fexample.com', detectPathTraversal, false);
test('Path: Allow C: in text', 'Save to C: drive', detectPathTraversal, false);
test('Path: Allow normal path', 'documents/report.pdf', detectPathTraversal, false);
test('Path: Allow relative path ./file', './config.json', detectPathTraversal, false);

// Should BLOCK (actual attacks)
test('Path: Block ../ traversal', '../../etc/passwd', detectPathTraversal, true);
test('Path: Block encoded traversal', '%2e%2e%2f%2e%2e%2fetc%2fpasswd', detectPathTraversal, true);
test('Path: Block file:// protocol', 'file:///etc/passwd', detectPathTraversal, true);
test('Path: Block Windows absolute', 'C:\\Windows\\System32', detectPathTraversal, true);
test('Path: Block UNC path', '\\\\server\\share', detectPathTraversal, true);
test('Path: Block null byte', '../../etc/passwd%00.jpg', detectPathTraversal, true);
test('Path: Block double encoded', '%252e%252e%252f', detectPathTraversal, true);

// ========== SQL INJECTION TESTS ==========
console.log(`\n${colors.yellow}━━━ SQL Injection Detection Tests ━━━${colors.reset}\n`);

// Should ALLOW (false positives we're fixing)
test('SQLi: Allow -- in product name', 'T-Shirt -- Blue Edition', detectSQLInjection, false);
test('SQLi: Allow -- in price', 'Price: $100 -- was $150', detectSQLInjection, false);
test('SQLi: Allow SQL keywords in text', 'I select the blue option', detectSQLInjection, false);
test('SQLi: Allow /* */ without SQL', '/* This is a comment */', detectSQLInjection, false);
test('SQLi: Allow job description', 'Database Administrator with SELECT experience', detectSQLInjection, false);
test('SQLi: Allow "where are you from"', 'Where are you from?', detectSQLInjection, false);
test('SQLi: Allow hashtag', 'Going on #vacation', detectSQLInjection, false);

// Should BLOCK (actual attacks)
test('SQLi: Block OR 1=1', "' OR 1=1--", detectSQLInjection, true);
test('SQLi: Block UNION SELECT', "' UNION SELECT * FROM users--", detectSQLInjection, true);
test('SQLi: Block stacked query', '; DROP TABLE users', detectSQLInjection, true);
test('SQLi: Block time-based', "1' AND SLEEP(5)--", detectSQLInjection, true);
test('SQLi: Block logic bomb', "' OR 'a'='a", detectSQLInjection, true);
test('SQLi: Block comment injection', "admin'--", detectSQLInjection, true);
test('SQLi: Block BENCHMARK', "1' AND BENCHMARK(1000000,MD5('test'))--", detectSQLInjection, true);

// ========== COMBINED TESTS ==========
console.log(`\n${colors.yellow}━━━ Combined Real-World Scenarios ━━━${colors.reset}\n`);

test('Real: Blog post with HTML', '<p>Hello <b>world</b>! Visit <a href="http://example.com">here</a></p>', detectXSS, false);
test('Real: OAuth callback URL', 'https://app.example.com/callback?code=abc123', detectPathTraversal, false);
test('Real: Product comparison', 'Product A -- Better than Product B', detectSQLInjection, false);
test('Real: Code snippet in docs', 'Use SELECT * FROM table', detectSQLInjection, false);
test('Real: Support ticket', 'I found XSS using <script> tags', detectXSS, false);

// ========== RESULTS ==========
console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║                        Test Results                        ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

const totalTests = passCount + failCount;
console.log(`Total Tests:  ${totalTests}`);
console.log(`${colors.green}Passed:       ${passCount}${colors.reset}`);
console.log(`${colors.red}Failed:       ${failCount}${colors.reset}`);

const successRate = ((passCount / totalTests) * 100).toFixed(1);
console.log(`Success Rate: ${successRate}%\n`);

if (failCount === 0) {
  console.log(`${colors.green}🎉 All tests passed! WAF is now more permissive!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}⚠️  Some tests failed. Review the output above.${colors.reset}\n`);
  process.exit(1);
}
