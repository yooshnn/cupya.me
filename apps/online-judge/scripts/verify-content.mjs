import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appRoot, exitWithFailure } from './lib.mjs';

const contentRoot = join(appRoot, 'public', 'oj-content');
const indexPath = join(contentRoot, 'problems.index.json');

let failed = false;

function fail(message) {
  failed = true;
  console.error(message);
}

function requirePath(relativePath) {
  const absolutePath = join(contentRoot, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`missing content: public/oj-content/${relativePath}`);
  }
  return absolutePath;
}

function readJson(absolutePath, label) {
  try {
    return JSON.parse(readFileSync(absolutePath, 'utf8'));
  }
  catch (error) {
    fail(`invalid JSON in ${label}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

requirePath('.');
requirePath('problems.index.json');
requirePath('problems');
requirePath('judge-cases');

const index = readJson(indexPath, 'public/oj-content/problems.index.json');
if (!Array.isArray(index)) {
  fail('public/oj-content/problems.index.json must be an array');
}

for (const item of Array.isArray(index) ? index : []) {
  if (!item || typeof item !== 'object') {
    fail('problem index item must be an object');
    continue;
  }

  const id = item.id;
  if (typeof id !== 'string' || id.length === 0) {
    fail('problem index item must have a non-empty string id');
    continue;
  }

  const problemPath = requirePath(`problems/${id}.json`);
  const problem = readJson(problemPath, `public/oj-content/problems/${id}.json`);
  if (!problem || typeof problem !== 'object') {
    continue;
  }

  if (problem.id !== id) {
    fail(`problem id mismatch: index has ${id}, problem file has ${String(problem.id)}`);
  }

  const judgeTestsPath = problem.judgeTests?.path;
  if (typeof judgeTestsPath !== 'string' || judgeTestsPath.length === 0) {
    fail(`problem ${id} must have judgeTests.path`);
  }
  else {
    requirePath(judgeTestsPath);
  }

  const checker = problem.judge?.problem?.checker;
  if (checker?.kind === 'custom') {
    const checkerPath = problem.checkerAsset?.path;
    if (typeof checkerPath !== 'string' || checkerPath.length === 0) {
      fail(`custom checker problem ${id} must have checkerAsset.path`);
    }
    else {
      requirePath(checkerPath);
    }
  }
}

if (failed) {
  exitWithFailure();
}

console.warn(`verified online judge content: ${contentRoot}`);
