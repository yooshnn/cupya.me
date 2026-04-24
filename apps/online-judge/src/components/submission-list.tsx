import type { SubmissionRecord } from '../lib/types';
import { resultPassed, resultStatus, statusClass, statusLabel } from '../lib/judge-result';

interface SubmissionListProps {
  submissions: SubmissionRecord[];
  onSelect: (submissionId: string) => void;
}

export function SubmissionList({ submissions, onSelect }: SubmissionListProps) {
  return (
    <div className="submission-list">
      <h3>제출 내역</h3>
      {submissions.length === 0
        ? <p className="empty-state">아직 채점한 코드가 없습니다.</p>
        : (
            <ul>
              {submissions.map(submission => (
                <li key={submission.id}>
                  <button type="button" onClick={() => onSelect(submission.id)}>
                    <span>{submission.submittedAt.toLocaleTimeString()}</span>
                    <span>{submission.mode === 'sample' ? '샘플' : '전체'}</span>
                    <span className={statusClass(resultStatus(submission.result))}>
                      {statusLabel(resultStatus(submission.result))}
                    </span>
                    <span>{resultPassed(submission.result)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}
