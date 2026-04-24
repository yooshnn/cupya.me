import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot, assertExists, exitWithFailure, resolveRuntimeRoot } from './lib.mjs';

const runtimeRoot = resolveRuntimeRoot();
const sourceDir = join(runtimeRoot, 'packages', 'runtime-browser', 'artifacts');
const targetDir = join(appRoot, 'public', 'judge-artifacts');

assertExists(sourceDir, `runtime artifacts directory not found: ${sourceDir}`);

if (existsSync(targetDir)) {
  const stat = lstatSync(targetDir);
  if (!stat.isSymbolicLink()) {
    console.error(`refusing to replace non-symlink artifact path: ${targetDir}`);
    exitWithFailure();
  }
  rmSync(targetDir);
}

mkdirSync(join(appRoot, 'public'), { recursive: true });
symlinkSync(sourceDir, targetDir, 'dir');
console.warn(`linked local judge artifacts: ${targetDir} -> ${sourceDir}`);
