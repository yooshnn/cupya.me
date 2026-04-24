import type { PageProps } from 'waku/router';
import { Link } from 'waku';
import { Markdown } from '../../../components/markdown';
import { getProblemBundle, getProblemIds } from '../../../lib/content';

export default async function EditorialPage({ id }: PageProps<'/problems/[id]/editorial'>) {
  const problem = getProblemBundle(id);

  return (
    <section className="page-shell">
      <title>{`${problem.title} 해설 | oj.cupya.me`}</title>
      <header className="problem-title">
        <p>{problem.source || problem.id}</p>
        <h1>{`${problem.title} 해설`}</h1>
        <Link to={`/problems/${problem.id}`}>문제로 돌아가기</Link>
      </header>
      <Markdown source={problem.editorialMarkdown} />
      <section className="solution-code" aria-label="정답 코드">
        <h2>정답 코드</h2>
        <pre>
          <code>{problem.solutionCode}</code>
        </pre>
      </section>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
    staticPaths: getProblemIds(),
  } as const;
};
