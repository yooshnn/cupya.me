'use client';

import type { JudgeTestCase } from '@cupya.me/wasm-judge-runtime-core';
import type { JudgeMode, ProblemBundle, RuntimeState, SubmissionRecord } from '../lib/types';
import { PlayIcon } from '@phosphor-icons/react';
import { lazy, Suspense, useState } from 'react';
import { buildJudgeRequest, ensureChecker, ensureRuntime, fetchJudgeCases } from '../lib/judge-client';
import { resultElapsed, resultPassed, resultStatus, statusClass, statusLabel } from '../lib/judge-result';
import { ResultDialog } from './result-dialog';

const SOURCE_LIMIT_BYTES = 200_000;
const CodeEditor = lazy(async () => {
  const module = await import('./code-editor');
  return { default: module.CodeEditor };
});

interface JudgePanelProps {
  problem: ProblemBundle;
}

export function JudgePanel({ problem }: JudgePanelProps) {
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [sourceCode, setSourceCode] = useState(problem.template);
  const [latestSubmission, setLatestSubmission] = useState<SubmissionRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [runningMode, setRunningMode] = useState<JudgeMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullTestsPromise, setFullTestsPromise] = useState<Promise<JudgeTestCase[]> | null>(null);

  async function activateEditor() {
    setRuntimeState('bootstrapping');
    setError(null);

    const testsPromise = fullTestsPromise ?? fetchJudgeCases(problem);
    setFullTestsPromise(testsPromise);

    try {
      await ensureChecker(problem);
      await Promise.all([ensureRuntime(), testsPromise]);
      setRuntimeState('ready');
    }
    catch (activationError) {
      setRuntimeState('error');
      setError(activationError instanceof Error ? activationError.message : String(activationError));
    }
  }

  async function runJudge(mode: JudgeMode) {
    setError(null);
    setRunningMode(mode);

    try {
      if (new Blob([sourceCode]).size > SOURCE_LIMIT_BYTES) {
        throw new Error('source code is too large for browser judging');
      }

      await ensureChecker(problem);
      const runtime = await ensureRuntime();
      setRuntimeState('ready');

      const tests
        = mode === 'sample'
          ? problem.sampleTests
          : await (fullTestsPromise ?? fetchJudgeCases(problem));
      const result = await runtime.judge(buildJudgeRequest(problem, sourceCode, tests));
      const submission: SubmissionRecord = {
        id: crypto.randomUUID(),
        mode,
        submittedAt: new Date(),
        result,
      };

      setLatestSubmission(submission);
      setDialogOpen(true);
    }
    catch (judgeError) {
      setError(judgeError instanceof Error ? judgeError.message : String(judgeError));
      if (runtimeState !== 'ready') {
        setRuntimeState('error');
      }
    }
    finally {
      setRunningMode(null);
    }
  }

  const isBusy = runtimeState === 'bootstrapping' || runningMode !== null;
  const overlayState: 'idle' | 'bootstrapping' | 'running' | null
    = runningMode
      ? 'running'
      : runtimeState === 'idle'
        ? 'idle'
        : runtimeState === 'bootstrapping'
          ? 'bootstrapping'
          : null;
  const shouldLoadEditor = overlayState !== 'idle';

  return (
    <section className="judge-panel" aria-label="C++ 채점">
      <div className="judge-panel__header">
        <div>
          <h2>
            채점
            <span
              className={`runtime-dot runtime-dot--${runningMode ? 'running' : runtimeState}`}
              aria-label={runningMode ? 'running' : runtimeState}
            />
          </h2>
          <p>C++ (Clang/LLVM 22, wasm32-wasi)</p>
        </div>
      </div>

      <div className="judge-editor-wrap">
        {shouldLoadEditor ? (
          <Suspense fallback={<EditorPreview value={sourceCode} />}>
            <CodeEditor
              className="code-editor"
              value={sourceCode}
              onChange={setSourceCode}
              readOnly={overlayState !== null}
            />
          </Suspense>
        ) : (
          <EditorPreview value={sourceCode} />
        )}
        <div className="judge-actions">
          <button
            className="judge-btn"
            type="button"
            disabled={isBusy || runtimeState !== 'ready'}
            onClick={() => runJudge('sample')}
          >
            샘플 채점
          </button>
          <button
            className="judge-btn"
            type="button"
            disabled={isBusy || runtimeState !== 'ready'}
            onClick={() => runJudge('full')}
          >
            전체 채점
          </button>
        </div>

        {overlayState && (
          <div
            className={`judge-overlay judge-overlay--${overlayState}`}
            onClick={overlayState === 'idle' ? activateEditor : undefined}
            role={overlayState === 'idle' ? 'button' : 'status'}
            tabIndex={overlayState === 'idle' ? 0 : undefined}
            onKeyDown={overlayState === 'idle' ? e => e.key === 'Enter' && activateEditor() : undefined}
            aria-label={
              overlayState === 'idle'
                ? '풀어보기'
                : overlayState === 'bootstrapping'
                  ? '컴파일러 로드 중'
                  : '채점 중'
            }
          >
            {overlayState === 'idle' && (
              <>
                <PlayIcon size={28} weight="fill" className="text-primary" />
                <span className="judge-overlay__title">풀어보기</span>
                <span className="judge-overlay__sub">C++ 컴파일러를 로드합니다 (~80MB)</span>
              </>
            )}
            {overlayState === 'bootstrapping' && (
              <>
                <span className="judge-overlay__title">준비 중</span>
                <span className="judge-overlay__sub">컴파일러와 테스트 데이터를 불러오는 중입니다</span>
              </>
            )}
            {overlayState === 'running' && (
              <>
                <span className="judge-overlay__title">채점 중</span>
                <span className="judge-overlay__sub">
                  {runningMode === 'sample' ? '샘플 테스트를 실행하는 중입니다' : '전체 테스트를 실행하는 중입니다'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="judge-error">{error}</p>}

      {latestSubmission && (
        <button
          type="button"
          className="submission-card"
          onClick={() => setDialogOpen(true)}
          aria-label="채점 결과 자세히 보기"
        >
          <span className={statusClass(resultStatus(latestSubmission.result))}>
            {statusLabel(resultStatus(latestSubmission.result))}
          </span>
          <span className="submission-card__mode">
            {latestSubmission.mode === 'sample' ? '샘플' : '전체'}
          </span>
          <span>{resultPassed(latestSubmission.result)}</span>
          <span>{resultElapsed(latestSubmission.result)}</span>
          <span className="submission-card__cta">자세히 →</span>
        </button>
      )}

      <ResultDialog
        submission={latestSubmission}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  );
}

function EditorPreview({ value }: { value: string }) {
  return (
    <div className="code-editor code-editor--preview" aria-hidden="true">
      <pre className="code-editor__preview-content">{value}</pre>
    </div>
  );
}
