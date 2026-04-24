import { Link } from 'waku';
import { getProblemIndex } from '../../lib/content';

export default async function ProblemsPage() {
  const problems = getProblemIndex();

  return (
    <section className="page-shell page-shell--narrow">
      <title>Problems | oj.cupya.me</title>
      <header className="page-header">
        <p>Problems</p>
        <h1>문제 목록</h1>
      </header>
      <div className="problem-list">
        {problems.map(problem => (
          <Link key={problem.id} to={`/problems/${problem.id}`} className="problem-list__item">
            <span>
              <strong>{problem.title}</strong>
              <small>{problem.source || problem.id}</small>
            </span>
            <span aria-hidden="true">→</span>
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
