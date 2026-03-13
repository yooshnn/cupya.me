import antfu from '@antfu/eslint-config';

export default function defineConfig(options = {}, ...userConfigs) {
  return antfu(
    {
      typescript: true,
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: true,
      },
      rules: {
        'no-empty-pattern': ['warn', { allowObjectPatternsAsParameters: true }],
        'no-console': 'warn',
        'ts/no-use-before-define': ['error', {
          functions: false,
          variables: false,
          typedefs: false,
          classes: true,
        }],
      },
      ...options,
    },
    ...userConfigs,
  );
}
