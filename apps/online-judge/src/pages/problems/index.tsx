import { Link } from 'waku';
import { getProblemBundle, getProblemIndex } from '../../lib/content';

export default async function ProblemsPage() {
  const problems = getProblemIndex().map((problem) => {
    const bundle = getProblemBundle(problem.id);
    return {
      ...problem,
      isSpecialJudge: bundle.judge.problem.checker.kind === 'custom',
    };
  });

  return (
    <section className="page-shell page-shell--narrow">
      <title>Problems | CPOJ</title>

      <header className="page-header problem-index__header">
        <p>Problems</p>
        <h1>문제 목록</h1>
        <span className="problem-index__count">
          {problems.length}
          개
        </span>
      </header>

      <div role="list" aria-label="문제 목록" className="plist">
        {problems.map((problem, i) => (
          <Link
            key={problem.id}
            to={`/problems/${problem.id}`}
            role="listitem"
            className="prow"
          >
            <span className="prow__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>

            <span className="prow__body">
              <span className="prow__id">{problem.id}</span>
              <span className="prow__title">
                <strong>{problem.title}</strong>
                {problem.isSpecialJudge && (
                  <span className="problem-row__spj">SPJ</span>
                )}
              </span>
              {problem.source && <small className="prow__source">{problem.source}</small>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
