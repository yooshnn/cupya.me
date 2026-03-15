import defineConfig from '@cupya.me/eslint-config';

export default defineConfig(
  {
    react: true,
    ignores: [
      '.wrangler/**',
      '.react-router/**',
      'build/**',
      'dist/**',
      'drizzle/**',
      'worker-configuration.d.ts',
      'react-router.config.ts',
      'package.json',
    ],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
