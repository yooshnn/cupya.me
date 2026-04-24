import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot, assertExists, resolveRuntimeRoot, run } from './lib.mjs';

const runtimeRoot = resolveRuntimeRoot();
const targetDir = join(appRoot, 'vendor', 'wasm-judge-runtime');
const packageDirs = ['packages/core', 'packages/runtime-cpp', 'packages/runtime-browser'];

assertExists(runtimeRoot, `wasm judge runtime repo not found: ${runtimeRoot}`);

mkdirSync(targetDir, { recursive: true });
for (const entry of readdirSync(targetDir)) {
  if (entry.endsWith('.tgz')) {
    rmSync(join(targetDir, entry));
  }
}

run('pnpm', ['build'], runtimeRoot);
for (const packageDir of packageDirs) {
  run('pnpm', ['pack', '--pack-destination', targetDir], join(runtimeRoot, packageDir));
}

console.warn(`vendored wasm judge runtime tarballs to ${targetDir}`);
