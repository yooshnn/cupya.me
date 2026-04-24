declare module '*.css';

interface ImportMetaEnv {
  readonly WAKU_PUBLIC_JUDGE_ARTIFACT_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: <T = unknown>(pattern: string | string[], options?: Record<string, unknown>) => Record<string, T>;
}
