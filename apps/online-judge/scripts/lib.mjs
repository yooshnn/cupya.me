import { resolve } from 'node:path';
import process from 'node:process';

export const appRoot = resolve(import.meta.dirname, '..');

export function exitWithFailure() {
  process.exit(1);
}
