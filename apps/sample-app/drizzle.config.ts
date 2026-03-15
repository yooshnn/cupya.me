import type { Config } from 'drizzle-kit';

export default {
  schema: './app/server/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
} satisfies Config;
