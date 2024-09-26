#!/usr/bin/env node
const { execSync } = require('child_process');

console.log("Starting MareJS (Express + React with File-Based Routing)...");

// Execute npm or pnpm commands to run the project
try {
  execSync('pnpm install', { stdio: 'inherit' });
  execSync('pnpm run dev', { stdio: 'inherit' });
} catch (err) {
  console.error("Error occurred while starting MareJS:", err);
}
