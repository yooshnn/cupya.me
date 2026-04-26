import type { PageProps } from 'waku/router';
import { Link } from 'waku';
import { JudgePanel } from '../../components/judge-panel';
import { Markdown } from '../../components/markdown';
import { ProblemLimits, SampleList } from '../../components/problem-meta';
import { getProblemBundle, getProblemIds } from '../../lib/content';

export default async function ProblemPage({ id }: PageProps<'/problems/[id]'>) {
  const problem = getProblemBundle(id);

  return (
    <section className="problem-page">
      <title>{`${problem.title} | CPOJ`}</title>
      <article className="problem-statement">
        <header className="problem-title">
          <p>{problem.source || problem.id}</p>
          <h1>{problem.title}</h1>
          <Link to={`/problems/${problem.id}/editorial`}>해설 보기</Link>
        </header>

        <ProblemLimits limits={problem.judge.problem.limits} />
        <Markdown source={problem.statementMarkdown} />
        <SampleList samples={problem.sampleTests} />
      </article>

      <aside className="judge-column">
        <JudgePanel problem={problem} />
      </aside>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
    staticPaths: getProblemIds(),
  } as const;
};
