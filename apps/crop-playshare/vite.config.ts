import { resolve } from 'node:path';
import { env } from 'node:process';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  define: {
    __COMMIT_SHA__: JSON.stringify(env.COMMIT_SHA ?? env.CF_PAGES_COMMIT_SHA ?? 'dev'),
  },
});
