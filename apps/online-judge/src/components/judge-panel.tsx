'use client';

import type { JudgeTestCase } from '@cupya.me/wasm-judge-runtime-core';
import type { JudgeMode, ProblemBundle, RuntimeState, SubmissionRecord } from '../lib/types';
import { useMemo, useState } from 'react';
import { buildJudgeRequest, ensureChecker, ensureRuntime, fetchJudgeCases } from '../lib/judge-client';
import { resultElapsed, resultPassed, resultStatus, statusClass, statusLabel } from '../lib/judge-result';
import { ResultModal } from './result-modal';
import { SubmissionList } from './submission-list';

const SOURCE_LIMIT_BYTES = 200_000;

interface JudgePanelProps {
  problem: ProblemBundle;
}

export function JudgePanel({ problem }: JudgePanelProps) {
  const [enabled, setEnabled] = useState(false);
  const [runtimeState, setRuntimeState] = useState<RuntimeState>('idle');
  const [sourceCode, setSourceCode] = useState(problem.template);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [runningMode, setRunningMode] = useState<JudgeMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullTestsPromise, setFullTestsPromise] = useState<Promise<JudgeTestCase[]> | null>(null);

  const selectedSubmission = useMemo(
    () => submissions.find(submission => submission.id === selectedSubmissionId) ?? null,
    [selectedSubmissionId, submissions],
  );

  async function activateEditor() {
    setEnabled(true);
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

      setSubmissions(current => [submission, ...current]);
      setSelectedSubmissionId(submission.id);
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

  const latest = submissions[0];
  const isBusy = runtimeState === 'bootstrapping' || runningMode !== null;
  const runningMessage = runningMode === 'sample' ? '샘플 채점 중입니다.' : '전체 채점 중입니다.';

  return (
    <section className="judge-panel" aria-label="C++ 채점">
      <div className="judge-panel__header">
        <div>
          <h2>채점</h2>
          <p>C++ (Clang/LLVM 22, wasm32-wasi)</p>
        </div>
        <span className={`runtime-dot runtime-dot--${runtimeState}`}>{runtimeState}</span>
      </div>

      {!enabled && (
        <button className="primary-action" type="button" onClick={activateEditor}>
          에디터 활성화
        </button>
      )}

      {enabled && (
        <>
          <textarea
            className="code-editor"
            value={sourceCode}
            spellCheck={false}
            onChange={event => setSourceCode(event.currentTarget.value)}
          />
          <div className="judge-actions">
            <button
              className="primary-action"
              type="button"
              disabled={isBusy || runtimeState === 'error'}
              onClick={() => runJudge('sample')}
            >
              샘플 채점
            </button>
            <button
              className="secondary-action"
              type="button"
              disabled={isBusy || runtimeState === 'error'}
              onClick={() => runJudge('full')}
            >
              전체 채점
            </button>
          </div>
        </>
      )}

      {runningMode && (
        <p className="judge-message">
          {runningMessage}
        </p>
      )}
      {runtimeState === 'bootstrapping' && (
        <p className="judge-message">컴파일러와 테스트 데이터를 불러오는 중입니다.</p>
      )}
      {error && <p className="judge-error">{error}</p>}

      {latest && (
        <div className="latest-result">
          <span className={statusClass(resultStatus(latest.result))}>
            {statusLabel(resultStatus(latest.result))}
          </span>
          <span>{resultPassed(latest.result)}</span>
          <span>{resultElapsed(latest.result)}</span>
        </div>
      )}

      <SubmissionList submissions={submissions} onSelect={setSelectedSubmissionId} />

      {selectedSubmission && (
        <ResultModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </section>
  );
}
