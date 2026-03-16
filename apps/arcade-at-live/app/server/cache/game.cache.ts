import type { Game } from '../db/schema';
import { createCache } from './utils';

const TTL = 60 * 60 * 24; // 24h

export const GamesByArcadeIdCache = createCache<Game[]>((arcadeId: number) => `games:${arcadeId}`, TTL);

export const getCachedGamesByArcadeId = (kv: KVNamespace, arcadeId: number) => GamesByArcadeIdCache.get(kv, arcadeId);
export const setCachedGamesByArcadeId = (kv: KVNamespace, arcadeId: number, data: Game[]) => GamesByArcadeIdCache.set(kv, data, arcadeId);
