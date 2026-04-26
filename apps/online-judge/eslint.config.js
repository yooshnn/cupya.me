import defineConfig from '@cupya.me/eslint-config';

export default defineConfig({
  react: true,
  ignores: [
    '.vscode/**',
    'dist/**',
    'package.json',
    'public/oj-content/**',
    'tsconfig.json',
    'worker-configuration.d.ts',
    'wrangler.jsonc',
  ],
}, {
  files: ['src/pages/**/*.tsx', 'src/pages/_layout.tsx'],
  rules: {
    'antfu/top-level-function': 'off',
    'react-refresh/only-export-components': 'off',
  },
});
