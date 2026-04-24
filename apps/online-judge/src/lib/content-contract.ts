import type { JudgeRequest, JudgeTestCase } from '@cupya.me/wasm-judge-runtime-core';
import type { ProblemBundle, ProblemIndexItem } from './types';

type ProblemJudge = Omit<JudgeRequest, 'submission' | 'problem'> & {
  problem: Omit<JudgeRequest['problem'], 'tests'>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, path: string): string {
  const value = record[key];
  if (typeof value !== 'string') {
    throw new TypeError(`${path}.${key} must be a string`);
  }

  return value;
}

function readRecord(record: Record<string, unknown>, key: string, path: string): Record<string, unknown> {
  const value = record[key];
  if (!isRecord(value)) {
    throw new TypeError(`${path}.${key} must be an object`);
  }

  return value;
}

function readArray(record: Record<string, unknown>, key: string, path: string): unknown[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new TypeError(`${path}.${key} must be an array`);
  }

  return value;
}

function readNumber(record: Record<string, unknown>, key: string, path: string): number {
  const value = record[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${path}.${key} must be a finite number`);
  }

  return value;
}

function readBoolean(record: Record<string, unknown>, key: string, path: string): boolean {
  const value = record[key];
  if (typeof value !== 'boolean') {
    throw new TypeError(`${path}.${key} must be a boolean`);
  }

  return value;
}

export function normalizeProblemIndex(value: unknown): ProblemIndexItem[] {
  if (!Array.isArray(value)) {
    throw new TypeError('problems.index.json must be an array');
  }

  return value.map((item, index) => normalizeProblemIndexItem(item, `problems.index[${index}]`));
}

function normalizeProblemIndexItem(value: unknown, path: string): ProblemIndexItem {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return {
    id: readString(value, 'id', path),
    title: readString(value, 'title', path),
    source: readString(value, 'source', path),
  };
}

export function normalizeProblemBundle(value: unknown, path: string): ProblemBundle {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  const checkerAsset = normalizeCheckerAsset(value.checkerAsset, `${path}.checkerAsset`);

  return {
    id: readString(value, 'id', path),
    title: readString(value, 'title', path),
    source: readString(value, 'source', path),
    statementMarkdown: readString(value, 'statementMarkdown', path),
    editorialMarkdown: readString(value, 'editorialMarkdown', path),
    solutionCode: readString(value, 'solutionCode', path),
    template: readString(value, 'template', path),
    judge: normalizeJudge(readRecord(value, 'judge', path), `${path}.judge`),
    sampleTests: readArray(value, 'sampleTests', path).map((item, index) =>
      normalizeJudgeTestCase(item, `${path}.sampleTests[${index}]`),
    ),
    judgeTests: {
      path: readString(readRecord(value, 'judgeTests', path), 'path', `${path}.judgeTests`),
    },
    ...(checkerAsset ? { checkerAsset } : {}),
  };
}

function normalizeCheckerAsset(value: unknown, path: string): ProblemBundle['checkerAsset'] {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return {
    path: readString(value, 'path', path),
  };
}

function normalizeJudge(value: Record<string, unknown>, path: string): ProblemJudge {
  const problem = readRecord(value, 'problem', path);

  return {
    language: normalizeLanguage(readString(value, 'language', path), `${path}.language`),
    compile: {
      flags: readArray(readRecord(value, 'compile', path), 'flags', `${path}.compile`).map((flag, index) => {
        if (typeof flag !== 'string') {
          throw new TypeError(`${path}.compile.flags[${index}] must be a string`);
        }

        return flag;
      }),
    },
    policy: normalizePolicy(readRecord(value, 'policy', path), `${path}.policy`),
    problem: {
      id: readString(problem, 'id', `${path}.problem`),
      limits: normalizeLimits(readRecord(problem, 'limits', `${path}.problem`), `${path}.problem.limits`),
      checker: normalizeChecker(readRecord(problem, 'checker', `${path}.problem`), `${path}.problem.checker`),
    },
  };
}

function normalizeLanguage(value: string, path: string): 'cpp' {
  if (value !== 'cpp') {
    throw new TypeError(`${path} must be "cpp"`);
  }

  return value;
}

function normalizePolicy(value: Record<string, unknown>, path: string): ProblemJudge['policy'] {
  return {
    stopOnFirstFailure: readBoolean(value, 'stopOnFirstFailure', path),
    stdoutLimitBytes: readNumber(value, 'stdoutLimitBytes', path),
    stderrLimitBytes: readNumber(value, 'stderrLimitBytes', path),
  };
}

function normalizeLimits(value: Record<string, unknown>, path: string): ProblemJudge['problem']['limits'] {
  return {
    timeLimitMs: readNumber(value, 'timeLimitMs', path),
    memoryLimitBytes: readNumber(value, 'memoryLimitBytes', path),
  };
}

function normalizeChecker(value: Record<string, unknown>, path: string): ProblemJudge['problem']['checker'] {
  const kind = readString(value, 'kind', path);

  if (kind === 'exact') {
    return {
      kind,
      ignoreTrailingWhitespace: readBoolean(value, 'ignoreTrailingWhitespace', path),
    };
  }

  if (kind === 'custom') {
    return {
      kind,
      checkerId: readString(value, 'checkerId', path),
    };
  }

  throw new TypeError(`${path}.kind must be "exact" or "custom"`);
}

function normalizeJudgeTestCase(value: unknown, path: string): JudgeTestCase {
  if (!isRecord(value)) {
    throw new TypeError(`${path} must be an object`);
  }

  return {
    id: readString(value, 'id', path),
    stdin: readString(value, 'stdin', path),
    expected: readString(value, 'expected', path),
  };
}
