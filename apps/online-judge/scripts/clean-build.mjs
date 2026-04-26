import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot } from './lib.mjs';

const distDir = join(appRoot, 'dist');

rmSync(distDir, { force: true, recursive: true });
console.warn(`removed build output: ${distDir}`);
