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

const DEFAULT_ARTIFACT_BASE_URL
  = 'https://judge-artifacts.cupya.me/wasm-judge-runtime/2026-04-24/';
const LOCAL_ARTIFACT_BASE_URL = '/judge-artifacts/';

type RuntimeWithTerminate = JudgeRuntime & { terminate: () => void };

interface ContentCheckerInput {
  execution: CheckerContext['execution'];
  test: JudgeTestCase;
}

type ContentChecker = (input: ContentCheckerInput) => CheckerOutcome | Promise<CheckerOutcome>;

const checkerRegistry: CheckerRegistry = {};
let runtimePromise: Promise<RuntimeWithTerminate> | null = null;

function getArtifactBaseUrl(): string {
  const configured = import.meta.env.WAKU_PUBLIC_JUDGE_ARTIFACT_BASE_URL;
  const hostname = globalThis.location?.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    return LOCAL_ARTIFACT_BASE_URL;
  }

  return configured ?? DEFAULT_ARTIFACT_BASE_URL;
}

export async function ensureRuntime(): Promise<RuntimeWithTerminate> {
  if (!runtimePromise) {
    runtimePromise = import('@cupya.me/wasm-judge-runtime-browser').then(({ createJudgeRuntime }) =>
      createJudgeRuntime({
        artifactBaseUrl: getArtifactBaseUrl(),
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

  const module = await import(/* @vite-ignore */ `/oj-content/${problem.checkerAsset.path}`);
  const exported = (module as { default?: unknown }).default;
  if (!isContentChecker(exported)) {
    throw new TypeError(`custom checker does not export a default function: ${checker.checkerId}`);
  }

  const adapter: CheckerFunction = context =>
    exported({
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
