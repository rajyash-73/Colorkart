#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js development server...');

// Run next dev command
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

nextProcess.on('error', (error) => {
  console.error(`Error starting Next.js server: ${error.message}`);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Next.js server exited with code ${code}`);
    process.exit(code);
  }
});