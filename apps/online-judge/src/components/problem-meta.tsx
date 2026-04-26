import type { JudgeTestCase } from '@cupya.me/wasm-judge-runtime-core';
import type { ProblemBundle } from '../lib/types';

interface ProblemLimitsProps {
  limits: ProblemBundle['judge']['problem']['limits'];
}

export function ProblemLimits({ limits }: ProblemLimitsProps) {
  const timeLimit = `시간 제한 ${limits.timeLimitMs} ms`;
  const memoryLimit = `메모리 제한 ${Math.round(limits.memoryLimitBytes / 1024 / 1024)} MiB`;

  return (
    <div className="limits">
      <span>{timeLimit}</span>
      <span>{memoryLimit}</span>
    </div>
  );
}

interface SampleListProps {
  samples: JudgeTestCase[];
}

export function SampleList({ samples }: SampleListProps) {
  return (
    <section className="samples" aria-label="예제">
      <h2>예제</h2>
      {samples.map((sample, index) => (
        <div className="sample" key={sample.id}>
          <h3>{`예제 ${index + 1}`}</h3>
          <div className="sample-grid">
            <div>
              <h4>입력</h4>
              <pre>{sample.stdin}</pre>
            </div>
            <div>
              <h4>출력</h4>
              <pre>{sample.expected}</pre>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
