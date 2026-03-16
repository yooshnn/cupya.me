import type { DB } from '~/server/db/client';
import type { Arcade, Channel, StreamRule } from '~/server/db/schema';
import {
  getCachedArcadeBySlug,
  getCachedArcades,
  getCachedChannelsByArcadeId,
  getCachedStreamRulesByArcadeId,
  setCachedArcadeBySlug,
  setCachedArcades,
  setCachedChannelsByArcadeId,
  setCachedStreamRulesByArcadeId,
} from '~/server/cache/arcade.cache';
import {
  queryArcadeBySlug,
  queryArcades,
  queryChannelsByArcadeId,
  queryStreamRulesByArcadeId,
} from '~/server/db/arcade.queries';

export async function getArcades(db: DB, kv: KVNamespace): Promise<Arcade[]> {
  const cached = await getCachedArcades(kv);
  if (cached)
    return cached;

  const arcades = await queryArcades(db);
  await setCachedArcades(kv, arcades);

  return arcades;
}

export async function getArcadeBySlug(db: DB, kv: KVNamespace, slug: string): Promise<Arcade> {
  const cached = await getCachedArcadeBySlug(kv, slug);
  if (cached)
    return cached;

  const arcade = await queryArcadeBySlug(db, slug);
  if (!arcade)
    throw new Response('Not Found', { status: 404 });

  await setCachedArcadeBySlug(kv, slug, arcade);
  return arcade;
}

export async function getChannelsByArcadeId(db: DB, kv: KVNamespace, arcadeId: number): Promise<Channel[]> {
  const cached = await getCachedChannelsByArcadeId(kv, arcadeId);
  if (cached)
    return cached;

  const channels = await queryChannelsByArcadeId(db, arcadeId);
  await setCachedChannelsByArcadeId(kv, arcadeId, channels);

  return channels;
}

export async function getStreamRulesByArcadeId(db: DB, kv: KVNamespace, arcadeId: number): Promise<StreamRule[]> {
  const cached = await getCachedStreamRulesByArcadeId(kv, arcadeId);
  if (cached)
    return cached;

  const rules = await queryStreamRulesByArcadeId(db, arcadeId);
  await setCachedStreamRulesByArcadeId(kv, arcadeId, rules);

  return rules;
}
