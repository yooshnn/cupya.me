import type { ProblemBundle, ProblemIndexItem } from './types';
import problemsIndex from '../../public/oj-content/problems.index.json';
import { normalizeProblemBundle, normalizeProblemIndex } from './content-contract';

const problemModules = import.meta.glob<unknown>(
  '../../public/oj-content/problems/*.json',
  {
    eager: true,
    import: 'default',
  },
);

export function getProblemIndex(): ProblemIndexItem[] {
  return normalizeProblemIndex(problemsIndex);
}

export function getProblemIds(): string[] {
  return getProblemIndex().map(problem => problem.id);
}

export function getProblemBundle(id: string): ProblemBundle {
  const modulePath = `../../public/oj-content/problems/${id}.json`;
  const problem = problemModules[modulePath];

  if (!problem) {
    throw new Error(`Unknown problem: ${id}`);
  }

  return normalizeProblemBundle(problem, `problems/${id}.json`);
}
