import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot, assertExists, resolveContentRoot, run } from './lib.mjs';

const contentRoot = resolveContentRoot();
const contentDist = join(contentRoot, 'dist');
const targetDir = join(appRoot, 'public', 'oj-content');

assertExists(contentRoot, `online judge content repo not found: ${contentRoot}`);

run('pnpm', ['validate'], contentRoot);
run('pnpm', ['build'], contentRoot);

assertExists(contentDist, `online judge content dist not found: ${contentDist}`);

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(contentDist, targetDir, { recursive: true });

console.warn(`synced online judge content to ${targetDir}`);
