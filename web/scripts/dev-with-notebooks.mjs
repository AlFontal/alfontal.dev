#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');

const children = [];

function start(name, args) {
  const child = spawn(process.execPath, args, {
    cwd: webRoot,
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[dev:notebooks] ${name} exited via ${signal}`);
    } else if (code && code !== 0) {
      console.error(`[dev:notebooks] ${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
  return child;
}

function shutdown(exitCode = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(exitCode);
}

start('watch-notebooks', [path.join(__dirname, 'watch-notebooks.mjs')]);
start('astro-dev', [path.join(webRoot, 'node_modules', 'astro', 'astro.js'), 'dev']);

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
