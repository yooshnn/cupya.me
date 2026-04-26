import type { JudgeResult, JudgeStatus } from '@cupya.me/wasm-judge-runtime-core';

export function statusLabel(status: JudgeStatus | string): string {
  const labels: Record<string, string> = {
    accepted: 'Accepted',
    wrong_answer: 'Wrong Answer',
    compile_error: 'Compile Error',
    runtime_error: 'Runtime Error',
    time_limit_exceeded: 'Time Limit Exceeded',
    memory_limit_exceeded: 'Memory Limit Exceeded',
    output_limit_exceeded: 'Output Limit Exceeded',
    internal_error: 'Internal Error',
  };

  return labels[status] ?? status;
}

export function statusClass(status: JudgeStatus | string): string {
  if (status === 'accepted') {
    return 'status-accepted';
  }

  if (status === 'compile_error') {
    return 'status-compile';
  }

  if (status === 'wrong_answer') {
    return 'status-wrong';
  }

  return 'status-error';
}

export function formatBytes(value: number | undefined): string {
  if (value === undefined) {
    return 'n/a';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KiB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MiB`;
}

export function resultStatus(result: JudgeResult): JudgeStatus {
  return result.phase === 'compile' ? 'compile_error' : result.summary.status;
}

export function resultPassed(result: JudgeResult): string {
  if (result.phase === 'compile') {
    return '0/0';
  }

  return `${result.summary.passed}/${result.summary.total}`;
}

export function resultElapsed(result: JudgeResult): string {
  if (result.phase === 'compile') {
    return `${result.compile.elapsedMs} ms`;
  }

  return `${result.summary.totalElapsedMs} ms`;
}
