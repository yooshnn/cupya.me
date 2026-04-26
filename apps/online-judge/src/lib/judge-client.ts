import type { JudgeRuntime } from '@cupya.me/wasm-judge-runtime-browser';
import type {
  CheckerContext,
  CheckerFunction,
  CheckerOutcome,
  CheckerRegistry,
  JudgeRequest,
  JudgeTestCase,
} from '@cupya.me/wasm-judge-runtime-core';
import type { ProblemBundle } from './types';

type RuntimeEnvName = 'WAKU_PUBLIC_JUDGE_SYSROOT_URL' | 'WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL';

const runtimeEnv: Record<RuntimeEnvName, string | undefined> = {
  WAKU_PUBLIC_JUDGE_SYSROOT_URL: import.meta.env.WAKU_PUBLIC_JUDGE_SYSROOT_URL,
  WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL: import.meta.env.WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL,
};

type RuntimeWithTerminate = JudgeRuntime & { terminate: () => void };

interface ContentCheckerInput {
  execution: CheckerContext['execution'];
  test: JudgeTestCase;
}

type ContentChecker = (input: ContentCheckerInput) => CheckerOutcome | Promise<CheckerOutcome>;

const checkerRegistry: CheckerRegistry = {};
const checkerModulePromises = new Map<string, Promise<ContentChecker>>();
let runtimePromise: Promise<RuntimeWithTerminate> | null = null;

function getRequiredRuntimeEnv(name: RuntimeEnvName): string {
  const value = runtimeEnv[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required for browser judging`);
  }
  return value;
}

export async function ensureRuntime(): Promise<RuntimeWithTerminate> {
  if (!runtimePromise) {
    runtimePromise = import('@cupya.me/wasm-judge-runtime-browser').then(({ createJudgeRuntime }) =>
      createJudgeRuntime({
        sysrootUrl: getRequiredRuntimeEnv('WAKU_PUBLIC_JUDGE_SYSROOT_URL'),
        yowaspClangBundleUrl: getRequiredRuntimeEnv('WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL'),
        checkers: checkerRegistry,
        version: 'online-judge-mvp',
      }),
    );
  }

  return runtimePromise;
}

function isContentChecker(value: unknown): value is ContentChecker {
  return typeof value === 'function';
}

async function loadContentChecker(path: string): Promise<ContentChecker> {
  const cached = checkerModulePromises.get(path);
  if (cached) {
    return cached;
  }

  const promise = fetch(`/oj-content/${path}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`failed to load custom checker: HTTP ${response.status}`);
      }

      const source = await response.text();
      const blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      try {
        const module = await import(/* @vite-ignore */ blobUrl);
        const exported = (module as { default?: unknown }).default;
        if (!isContentChecker(exported)) {
          throw new TypeError(`custom checker does not export a default function: ${path}`);
        }

        return exported;
      }
      finally {
        URL.revokeObjectURL(blobUrl);
      }
    })
    .catch((error) => {
      checkerModulePromises.delete(path);
      throw error;
    });

  checkerModulePromises.set(path, promise);
  return promise;
}

export async function ensureChecker(problem: ProblemBundle): Promise<void> {
  const checker = problem.judge.problem.checker;
  if (checker.kind !== 'custom') {
    return;
  }

  if (checkerRegistry[checker.checkerId]) {
    return;
  }

  if (!problem.checkerAsset) {
    throw new Error(`custom checker asset is missing: ${checker.checkerId}`);
  }

  const checkerModule = await loadContentChecker(problem.checkerAsset.path);
  const adapter: CheckerFunction = context =>
    checkerModule({
      execution: context.execution,
      test: context.testCase,
    });
  checkerRegistry[checker.checkerId] = adapter;
}

export async function fetchJudgeCases(problem: ProblemBundle): Promise<JudgeTestCase[]> {
  const response = await fetch(`/oj-content/${problem.judgeTests.path}`);
  if (!response.ok) {
    throw new Error(`failed to load judge cases: HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new TypeError('judge cases response must be an array');
  }

  return data.map((item, index) => normalizeJudgeCase(item, index));
}

function normalizeJudgeCase(item: unknown, index: number): JudgeTestCase {
  if (!item || typeof item !== 'object') {
    throw new TypeError(`judge case at index ${index} must be an object`);
  }

  const record = item as Record<string, unknown>;
  return {
    id: String(record.id ?? `case-${index + 1}`),
    stdin: String(record.stdin ?? ''),
    expected: String(record.expected ?? ''),
  };
}

export function buildJudgeRequest(
  problem: ProblemBundle,
  sourceCode: string,
  tests: JudgeTestCase[],
): JudgeRequest {
  return {
    language: problem.judge.language,
    submission: { sourceCode },
    compile: problem.judge.compile,
    policy: problem.judge.policy,
    problem: {
      ...problem.judge.problem,
      tests,
    },
  };
}
