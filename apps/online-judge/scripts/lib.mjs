import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

export const appRoot = resolve(import.meta.dirname, '..');

export function resolveContentRoot() {
  return resolve(process.env.ONLINE_JUDGE_CONTENT_DIR ?? '/home/yooshnn/projects/online-judge-content');
}

export function resolveRuntimeRoot() {
  return resolve(
    process.env.WASM_JUDGE_RUNTIME_DIR ?? '/home/yooshnn/projects/In-Browser-Wasm-Judge-Runtime',
  );
}

export function assertExists(path, message) {
  if (existsSync(path)) {
    return;
  }

  console.error(message);
  process.exit(1);
}

export function exitWithFailure() {
  process.exit(1);
}

export function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    shell: false,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
