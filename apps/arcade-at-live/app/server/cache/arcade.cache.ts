import type { Arcade, Channel, StreamRule } from '../db/schema';
import { createCache } from './utils';

const TTL = 60 * 60 * 24; // 24h

export const ArcadesCache = createCache<Arcade[]>(() => 'arcades', TTL);
export const ArcadeBySlugCache = createCache<Arcade>((slug: string) => `arcade:${slug}`, TTL);
export const ChannelsCache = createCache<Channel[]>((arcadeId: number) => `channels:${arcadeId}`, TTL);
export const StreamRulesCache = createCache<StreamRule[]>((arcadeId: number) => `stream-rules:${arcadeId}`, TTL);

export const getCachedArcades = ArcadesCache.get;
export const setCachedArcades = ArcadesCache.set;
export const invalidateCachedArcades = ArcadesCache.invalidate;

export const getCachedArcadeBySlug = (kv: KVNamespace, slug: string) => ArcadeBySlugCache.get(kv, slug);
export const setCachedArcadeBySlug = (kv: KVNamespace, slug: string, data: Arcade) => ArcadeBySlugCache.set(kv, data, slug);

export const getCachedChannelsByArcadeId = (kv: KVNamespace, arcadeId: number) => ChannelsCache.get(kv, arcadeId);
export const setCachedChannelsByArcadeId = (kv: KVNamespace, arcadeId: number, data: Channel[]) => ChannelsCache.set(kv, data, arcadeId);

export const getCachedStreamRulesByArcadeId = (kv: KVNamespace, arcadeId: number) => StreamRulesCache.get(kv, arcadeId);
export const setCachedStreamRulesByArcadeId = (kv: KVNamespace, arcadeId: number, data: StreamRule[]) => StreamRulesCache.set(kv, data, arcadeId);
