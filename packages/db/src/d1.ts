import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';

export type { DrizzleD1Database };

export function createD1Client<TSchema extends Record<string, unknown>>(
  d1: D1Database,
  schema: TSchema,
): DrizzleD1Database<TSchema> {
  return drizzle(d1, { schema });
}
