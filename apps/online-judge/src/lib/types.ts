import type { JudgeRequest, JudgeResult, JudgeTestCase } from '@cupya.me/wasm-judge-runtime-core';

export interface ProblemIndexItem {
  id: string;
  title: string;
  source: string;
}

export interface ProblemBundle {
  id: string;
  title: string;
  source: string;
  statementMarkdown: string;
  editorialMarkdown: string;
  solutionCode: string;
  template: string;
  judge: Omit<JudgeRequest, 'submission' | 'problem'> & {
    problem: Omit<JudgeRequest['problem'], 'tests'>;
  };
  sampleTests: JudgeTestCase[];
  judgeTests: {
    path: string;
  };
  checkerAsset?: {
    path: string;
  };
}

export type JudgeMode = 'sample' | 'full';

export type RuntimeState = 'idle' | 'bootstrapping' | 'ready' | 'error';

export interface SubmissionRecord {
  id: string;
  mode: JudgeMode;
  submittedAt: Date;
  result: JudgeResult;
}
