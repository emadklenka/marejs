/**
 * WAF (Web Application Firewall) Test Suite
 *
 * Tests all WAF protection mechanisms:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - Path Traversal
 *
 * Usage: node tests/waftest.js
 *
 * Make sure your server is running on http://localhost:4000 before running tests
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const BASE_URL = process.env.TEST_URL || 'http://localhost:4000';
const TEST_ENDPOINT = '/api/public/publichello';

let passCount = 0;
let failCount = 0;
let totalTests = 0;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Make HTTP request
 */
function makeRequest(method, path, body = null, contentType = 'application/json') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': contentType,
      },
    };

    if (body && method !== 'GET') {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, body: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body && method !== 'GET') {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      req.write(bodyStr);
    }

    req.end();
  });
}

/**
 * Test helper
 */
async function test(description, method, path, body, shouldBlock, attackType = null) {
  totalTests++;
  try {
    const response = await makeRequest(method, path, body);
    const isBlocked = response.status === 403 && response.body.error === 'Forbidden';

    if (shouldBlock === isBlocked) {
      passCount++;
      console.log(`${colors.green}✓${colors.reset} ${description}`);
      return true;
    } else {
      failCount++;
      if (shouldBlock) {
        console.log(`${colors.red}✗${colors.reset} ${description}`);
        console.log(`  ${colors.red}Expected: BLOCKED, Got: ALLOWED${colors.reset}`);
        console.log(`  Response:`, response.body);
      } else {
        console.log(`${colors.red}✗${colors.reset} ${description}`);
        console.log(`  ${colors.red}Expected: ALLOWED, Got: BLOCKED${colors.reset}`);
        console.log(`  Blocked as:`, response.body.threats);
      }
      return false;
    }
  } catch (error) {
    failCount++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║         WAF (Web Application Firewall) Test Suite         ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\nTesting against: ${colors.blue}${BASE_URL}${TEST_ENDPOINT}${colors.reset}\n`);

  // ========== LEGITIMATE REQUESTS (Should PASS) ==========
  console.log(`${colors.yellow}━━━ Legitimate Requests (Should PASS) ━━━${colors.reset}\n`);

  await test(
    'Normal GET request',
    'GET',
    `${TEST_ENDPOINT}?name=John`,
    null,
    false
  );

  await test(
    'Normal POST request',
    'POST',
    TEST_ENDPOINT,
    { name: 'John Doe', email: 'john@example.com' },
    false
  );

  await test(
    'Text containing "union" word',
    'GET',
    `${TEST_ENDPOINT}?img=someunion`,
    null,
    false
  );

  await test(
    'Normal English with "select"',
    'GET',
    `${TEST_ENDPOINT}?text=I select the blue option`,
    null,
    false
  );

  await test(
    'Name containing "and"',
    'GET',
    `${TEST_ENDPOINT}?name=Chris Anderson`,
    null,
    false
  );

  await test(
    'CV text with SQL keywords',
    'GET',
    `${TEST_ENDPOINT}?bio=Database Administrator with SELECT experience`,
    null,
    false
  );

  await test(
    'Question with "where" and "from"',
    'GET',
    `${TEST_ENDPOINT}?location=Where are you from`,
    null,
    false
  );

  await test(
    'Hashtag (URL fragment)',
    'GET',
    `${TEST_ENDPOINT}?tag=%23vacation`,
    null,
    false
  );

  await test(
    'File path without traversal',
    'GET',
    `${TEST_ENDPOINT}?file=documents/report.pdf`,
    null,
    false
  );

  await test(
    'Normal HTML in POST',
    'POST',
    TEST_ENDPOINT,
    { content: 'Hello <b>World</b>' },
    false
  );

  // ========== XSS ATTACKS (Should BLOCK) ==========
  console.log(`\n${colors.yellow}━━━ XSS Attacks (Should BLOCK) ━━━${colors.reset}\n`);

  await test(
    'XSS: Basic script tag (GET)',
    'GET',
    `${TEST_ENDPOINT}?xss=<script>alert(1)</script>`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: URL encoded script tag',
    'GET',
    `${TEST_ENDPOINT}?xss=%3Cscript%3Ealert(1)%3C/script%3E`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: Script tag in POST body',
    'POST',
    TEST_ENDPOINT,
    { payload: '<script>alert(1)</script>' },
    true,
    'XSS'
  );

  await test(
    'XSS: Event handler',
    'GET',
    `${TEST_ENDPOINT}?img=x onerror=alert(1)`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: JavaScript protocol',
    'GET',
    `${TEST_ENDPOINT}?url=javascript:alert(1)`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: iframe injection',
    'GET',
    `${TEST_ENDPOINT}?code=<iframe src=javascript:alert(1)>`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: SVG with onload',
    'POST',
    TEST_ENDPOINT,
    { svg: '<svg onload=alert(1)>' },
    true,
    'XSS'
  );

  await test(
    'XSS: IMG tag',
    'GET',
    `${TEST_ENDPOINT}?test=<img src=x>`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: onmouseover event',
    'GET',
    `${TEST_ENDPOINT}?test=<div onmouseover=alert(1)>`,
    null,
    true,
    'XSS'
  );

  await test(
    'XSS: data:text/html',
    'GET',
    `${TEST_ENDPOINT}?url=data:text/html,<script>alert(1)</script>`,
    null,
    true,
    'XSS'
  );

  // ========== SQL INJECTION ATTACKS (Should BLOCK) ==========
  console.log(`\n${colors.yellow}━━━ SQL Injection Attacks (Should BLOCK) ━━━${colors.reset}\n`);

  await test(
    'SQLi: Classic OR 1=1 (GET)',
    'GET',
    `${TEST_ENDPOINT}?id=' OR 1=1--`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: OR 1=1 in POST body',
    'POST',
    TEST_ENDPOINT,
    { id: "' OR 1=1--" },
    true,
    'SQLi'
  );

  await test(
    'SQLi: UNION SELECT',
    'GET',
    `${TEST_ENDPOINT}?search=' UNION SELECT * FROM users--`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: UNION ALL SELECT',
    'GET',
    `${TEST_ENDPOINT}?id=1 UNION ALL SELECT password FROM users`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Stacked query - DROP TABLE',
    'GET',
    `${TEST_ENDPOINT}?cmd=; DROP TABLE users`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Time-based blind (SLEEP)',
    'GET',
    `${TEST_ENDPOINT}?delay=1' AND SLEEP(5)--`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: BENCHMARK attack',
    'POST',
    TEST_ENDPOINT,
    { test: "1' AND BENCHMARK(1000000,MD5('test'))--" },
    true,
    'SQLi'
  );

  await test(
    'SQLi: OR a=a variant',
    'GET',
    `${TEST_ENDPOINT}?username=admin' OR 'a'='a`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Double quote variant',
    'GET',
    `${TEST_ENDPOINT}?id=" OR "1"="1`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Comment-based',
    'GET',
    `${TEST_ENDPOINT}?id=1'--`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Multi-line comment',
    'GET',
    `${TEST_ENDPOINT}?id=1'/**/OR/**/1=1--`,
    null,
    true,
    'SQLi'
  );

  await test(
    'SQLi: Stacked INSERT',
    'GET',
    `${TEST_ENDPOINT}?cmd=; INSERT INTO users VALUES('hacker','pass')`,
    null,
    true,
    'SQLi'
  );

  // ========== PATH TRAVERSAL ATTACKS (Should BLOCK) ==========
  console.log(`\n${colors.yellow}━━━ Path Traversal Attacks (Should BLOCK) ━━━${colors.reset}\n`);

  await test(
    'Path Traversal: Basic ../ (GET)',
    'GET',
    `${TEST_ENDPOINT}?file=../../etc/passwd`,
    null,
    true,
    'Path Traversal'
  );

  await test(
    'Path Traversal: ../ in POST',
    'POST',
    TEST_ENDPOINT,
    { file: '../../../etc/passwd' },
    true,
    'Path Traversal'
  );

  await test(
    'Path Traversal: URL encoded',
    'GET',
    `${TEST_ENDPOINT}?file=%2e%2e%2f%2e%2e%2fetc%2fpasswd`,
    null,
    true,
    'Path Traversal'
  );

  await test(
    'Path Traversal: Double encoded',
    'GET',
    `${TEST_ENDPOINT}?file=%252e%252e%252f`,
    null,
    true,
    'Path Traversal'
  );

  await test(
    'Path Traversal: Windows backslash',
    'GET',
    `${TEST_ENDPOINT}?file=..\\..\\windows\\system32`,
    null,
    true,
    'Path Traversal'
  );

  await test(
    'Path Traversal: Null byte injection',
    'GET',
    `${TEST_ENDPOINT}?file=../../etc/passwd%00.jpg`,
    null,
    true,
    'Path Traversal'
  );

  // ========== COMBINED ATTACKS (Should BLOCK) ==========
  console.log(`\n${colors.yellow}━━━ Combined Attacks (Should BLOCK) ━━━${colors.reset}\n`);

  await test(
    'Combined: XSS + SQL injection',
    'POST',
    TEST_ENDPOINT,
    {
      name: '<script>alert(1)</script>',
      id: "' OR 1=1--"
    },
    true,
    'XSS + SQLi'
  );

  await test(
    'Combined: Path traversal + XSS',
    'GET',
    `${TEST_ENDPOINT}?file=../../etc/passwd&xss=<script>alert(1)</script>`,
    null,
    true,
    'Path Traversal + XSS'
  );

  // ========== RESULTS ==========
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                        Test Results                        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`Total Tests:  ${totalTests}`);
  console.log(`${colors.green}Passed:       ${passCount}${colors.reset}`);
  console.log(`${colors.red}Failed:       ${failCount}${colors.reset}`);

  const successRate = ((passCount / totalTests) * 100).toFixed(1);
  console.log(`Success Rate: ${successRate}%\n`);

  if (failCount === 0) {
    console.log(`${colors.green}🎉 All tests passed! Your WAF is working perfectly!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please review the WAF configuration.${colors.reset}\n`);
    process.exit(1);
  }
}

// Check if server is accessible
async function checkServer() {
  try {
    console.log(`Checking if server is running at ${BASE_URL}...`);
    await makeRequest('GET', TEST_ENDPOINT, null);
    console.log(`${colors.green}✓ Server is accessible${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Cannot connect to server at ${BASE_URL}${colors.reset}`);
    console.error(`${colors.red}  Error: ${error.message}${colors.reset}`);
    console.error(`\nPlease make sure your server is running before running tests.`);
    console.error(`You can change the test URL by setting the TEST_URL environment variable:\n`);
    console.error(`  TEST_URL=http://localhost:3002 node tests/waftest.js\n`);
    process.exit(1);
  }
}

// Run tests
(async () => {
  await checkServer();
  await runTests();
})();
