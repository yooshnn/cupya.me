'use client';

import type { SubmissionRecord } from '../lib/types';
import { Dialog } from '@base-ui/react/dialog';
import { XIcon } from '@phosphor-icons/react';
import { formatBytes, resultStatus, statusClass, statusLabel } from '../lib/judge-result';

interface ResultDialogProps {
  submission: SubmissionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResultDialog({ submission, open, onOpenChange }: ResultDialogProps) {
  if (!submission)
    return null;

  const { result } = submission;
  const status = resultStatus(result);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="result-backdrop" />
        <Dialog.Popup className="result-popup">
          <div className="result-popup__header">
            <div>
              <p className="result-popup__mode">
                {submission.mode === 'sample' ? '샘플 채점' : '전체 채점'}
              </p>
              <Dialog.Title className={`result-popup__title ${statusClass(status)}`}>
                {statusLabel(status)}
              </Dialog.Title>
            </div>
            <Dialog.Close className="result-popup__close" aria-label="닫기">
              <XIcon size={16} />
            </Dialog.Close>
          </div>

          {result.phase === 'compile'
            ? <CompileErrorSection result={result} />
            : <FinishedSection result={result} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type CompileJudgeResult = Extract<SubmissionRecord['result'], { phase: 'compile' }>;
type FinishedJudgeResult = Extract<SubmissionRecord['result'], { phase: 'finished' }>;

function CompileErrorSection({ result }: { result: CompileJudgeResult }) {
  return (
    <div className="result-section">
      <h3>컴파일 에러</h3>
      <pre>{result.compile.stderr || result.compile.errors.join('\n') || result.compile.stdout}</pre>
    </div>
  );
}

function FinishedSection({ result }: { result: FinishedJudgeResult }) {
  const failed = result.tests.filter(t => t.status !== 'accepted');
  const passed = result.tests.filter(t => t.status === 'accepted');

  return (
    <div>
      <div className="result-stats">
        <div className="result-stat">
          <span>통과</span>
          <strong>
            {result.summary.passed}
            /
            {result.summary.total}
          </strong>
        </div>
        <div className="result-stat">
          <span>시간</span>
          <strong>
            {result.summary.totalElapsedMs}
            {' '}
            ms
          </strong>
        </div>
        <div className="result-stat">
          <span>메모리</span>
          <strong>{formatBytes(result.summary.memoryBytes)}</strong>
        </div>
      </div>

      {failed.length > 0 && (
        <div className="result-section">
          <h3>
            실패한 테스트케이스
            <span className="result-count">{failed.length}</span>
          </h3>
          <div className="test-list">
            {failed.map(test => (
              <div key={test.id} className="test-item test-item--fail">
                <div className="test-item__header">
                  <span className="test-item__id">{test.id}</span>
                  <span className={statusClass(test.status)}>{statusLabel(test.status)}</span>
                  <span className="test-item__time">
                    {test.elapsedMs}
                    {' '}
                    ms
                  </span>
                </div>
                {test.message && <p className="test-item__msg">{test.message}</p>}
                <div className="io-grid">
                  <div>
                    <h4>stdout</h4>
                    <pre>{test.stdout ?? ''}</pre>
                  </div>
                  <div>
                    <h4>stderr</h4>
                    <pre>{test.stderr ?? ''}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {passed.length > 0 && (
        <details className="result-section result-section--passed">
          <summary>
            통과한 테스트케이스
            <span className="result-count">{passed.length}</span>
          </summary>
          <div className="test-list test-list--compact">
            {passed.map(test => (
              <div key={test.id} className="test-item test-item--pass">
                <span className="test-item__id">{test.id}</span>
                <span className="status-accepted">AC</span>
                <span className="test-item__time">
                  {test.elapsedMs}
                  {' '}
                  ms
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
