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
    ],
  },
  {
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
);
