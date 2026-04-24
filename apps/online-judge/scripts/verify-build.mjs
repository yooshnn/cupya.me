import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot, exitWithFailure } from './lib.mjs';

const required = [
  'dist/public',
  'dist/public/oj-content/problems.index.json',
  'dist/public/oj-content/problems',
  'dist/public/oj-content/judge-cases',
];
const forbidden = [
  'dist/public/judge-artifacts',
];

let failed = false;
for (const relativePath of required) {
  const absolutePath = join(appRoot, relativePath);
  if (!existsSync(absolutePath)) {
    failed = true;
    console.error(`missing build output: ${relativePath}`);
  }
}

for (const relativePath of forbidden) {
  const absolutePath = join(appRoot, relativePath);
  if (existsSync(absolutePath)) {
    failed = true;
    console.error(`forbidden build output: ${relativePath}`);
  }
}

if (failed) {
  exitWithFailure();
}

console.warn('verified online judge build outputs');
