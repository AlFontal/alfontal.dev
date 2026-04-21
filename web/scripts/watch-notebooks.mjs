#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const notebooksRoot = path.resolve(webRoot, '..', 'notebooks');

if (!existsSync(notebooksRoot)) {
  console.error(`[watch:notebooks] notebooks directory not found at ${notebooksRoot}`);
  process.exit(1);
}

let running = null;
let queued = false;
let debounce = null;

function runRender(reason = 'change detected') {
  if (running) {
    queued = true;
    return;
  }

  console.log(`[watch:notebooks] ${reason}; rendering notebook content...`);
  running = spawn(process.execPath, [path.join(__dirname, 'render-notebooks.mjs')], {
    cwd: webRoot,
    stdio: 'inherit',
  });

  running.on('exit', (code) => {
    running = null;
    if (code === 0) {
      console.log('[watch:notebooks] render complete.');
    } else {
      console.error(`[watch:notebooks] render failed with exit code ${code}.`);
    }

    if (queued) {
      queued = false;
      runRender('queued changes detected');
    }
  });
}

function scheduleRender(reason) {
  clearTimeout(debounce);
  debounce = setTimeout(() => runRender(reason), 180);
}

runRender('initial startup');

try {
  watch(notebooksRoot, { recursive: true }, (_eventType, filename) => {
    if (!filename) return;
    if (filename.startsWith('.')) return;
    if (filename.includes(`${path.sep}.`)) return;
    scheduleRender(`updated ${filename}`);
  });
  console.log(`[watch:notebooks] watching ${notebooksRoot}`);
} catch (error) {
  console.error('[watch:notebooks] recursive file watching is not available in this environment.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

process.on('SIGINT', () => {
  running?.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  running?.kill('SIGTERM');
  process.exit(0);
});
