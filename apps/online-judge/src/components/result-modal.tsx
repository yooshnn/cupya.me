import type { SubmissionRecord } from '../lib/types';
import { formatBytes, resultStatus, statusClass, statusLabel } from '../lib/judge-result';

interface ResultModalProps {
  submission: SubmissionRecord;
  onClose: () => void;
}

export function ResultModal({ submission, onClose }: ResultModalProps) {
  const { result } = submission;
  const status = resultStatus(result);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="result-modal"
        role="dialog"
        aria-modal="true"
        onClick={event => event.stopPropagation()}
      >
        <div className="result-modal__header">
          <div>
            <p>{submission.mode === 'sample' ? '샘플 채점' : '전체 채점'}</p>
            <h2 className={statusClass(status)}>{statusLabel(status)}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        {result.phase === 'compile'
          ? <CompileError result={result} />
          : <FinishedResult result={result} />}
      </div>
    </div>
  );
}

type CompileJudgeResult = Extract<SubmissionRecord['result'], { phase: 'compile' }>;
type FinishedJudgeResult = Extract<SubmissionRecord['result'], { phase: 'finished' }>;

interface CompileErrorProps {
  result: CompileJudgeResult;
}

function CompileError({ result }: CompileErrorProps) {
  return (
    <div className="modal-section">
      <h3>컴파일 에러</h3>
      <pre>{result.compile.stderr || result.compile.errors.join('\n') || result.compile.stdout}</pre>
    </div>
  );
}

interface FinishedResultProps {
  result: FinishedJudgeResult;
}

function FinishedResult({ result }: FinishedResultProps) {
  const passed = `${result.summary.passed}/${result.summary.total}`;
  const elapsed = `${result.summary.totalElapsedMs} ms`;

  return (
    <>
      <div className="result-grid">
        <span>통과</span>
        <strong>{passed}</strong>
        <span>총 시간</span>
        <strong>{elapsed}</strong>
        <span>메모리</span>
        <strong>{formatBytes(result.summary.memoryBytes)}</strong>
      </div>
      <div className="modal-section">
        <h3>테스트케이스</h3>
        <div className="test-results">
          {result.tests.map(test => (
            <details key={test.id}>
              <summary>
                <span>{test.id}</span>
                <span className={statusClass(test.status)}>{statusLabel(test.status)}</span>
                <span>{`${test.elapsedMs} ms`}</span>
              </summary>
              {test.message && <p>{test.message}</p>}
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
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
