import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { cloudflare } from '@cloudflare/vite-plugin';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'waku/config';

const publicEnvNames = [
  'WAKU_PUBLIC_JUDGE_SYSROOT_URL',
  'WAKU_PUBLIC_YOWASP_CLANG_BUNDLE_URL',
] as const;

function readWranglerVar(name: (typeof publicEnvNames)[number]): string | undefined {
  const wranglerConfig = readFileSync(resolve(import.meta.dirname, 'wrangler.jsonc'), 'utf8');
  const match = wranglerConfig.match(new RegExp(`"${name}"\\s*:\\s*"([^"]+)"`));
  return match?.[1];
}

const publicEnvDefines = Object.fromEntries(
  publicEnvNames.map(name => [
    `import.meta.env.${name}`,
    JSON.stringify(process.env[name] ?? readWranglerVar(name)),
  ]),
);

export default defineConfig({
  vite: {
    define: publicEnvDefines,
    envPrefix: ['VITE_', 'WAKU_PUBLIC_'],
    environments: {
      rsc: {
        optimizeDeps: {
          include: ['hono/tiny'],
        },
        build: {
          rolldownOptions: {
            platform: 'neutral',
          } as never,
        },
      },
      ssr: {
        optimizeDeps: {
          include: ['waku > rsc-html-stream/server'],
        },
        build: {
          rolldownOptions: {
            platform: 'neutral',
          } as never,
        },
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        inspectorPort: false,
      }),
    ],
  },
});
