import type { DB } from '../db/client';
import { asc, eq } from 'drizzle-orm';
import { arcades, channels, stream_rules } from './schema';

export async function queryArcades(db: DB) {
  return db.query.arcades.findMany({
    where: eq(arcades.is_closed, false),
    orderBy: asc(arcades.name),
  });
}

export async function queryArcadeBySlug(db: DB, slug: string) {
  return db.query.arcades.findFirst({
    where: eq(arcades.slug, slug),
  });
}

export async function queryChannelsByArcadeId(db: DB, arcadeId: number) {
  return db.query.channels.findMany({
    where: eq(channels.arcade_id, arcadeId),
  });
}

export async function queryStreamRulesByArcadeId(db: DB, arcadeId: number) {
  return db.query.stream_rules.findMany({
    where: eq(stream_rules.arcade_id, arcadeId),
    orderBy: asc(stream_rules.priority),
  });
}
