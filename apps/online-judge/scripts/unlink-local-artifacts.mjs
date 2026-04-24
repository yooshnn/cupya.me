import { existsSync, lstatSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { appRoot, exitWithFailure } from './lib.mjs';

const targetDir = join(appRoot, 'public', 'judge-artifacts');

if (!existsSync(targetDir)) {
  process.exit(0);
}

const stat = lstatSync(targetDir);
if (!stat.isSymbolicLink()) {
  console.error(`refusing to remove non-symlink artifact path: ${targetDir}`);
  exitWithFailure();
}

rmSync(targetDir);
console.warn(`removed local judge artifacts symlink: ${targetDir}`);
