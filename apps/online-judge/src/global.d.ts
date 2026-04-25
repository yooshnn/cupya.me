declare module '*.css';

interface ImportMetaEnv {
  readonly WAKU_PUBLIC_JUDGE_SYSROOT_URL?: string;
  readonly WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: <T = unknown>(pattern: string | string[], options?: Record<string, unknown>) => Record<string, T>;
}
