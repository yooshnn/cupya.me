import type { DB } from '~/server/db/client';
import type { Game } from '~/server/db/schema';
import { getCachedGamesByArcadeId, setCachedGamesByArcadeId } from '~/server/cache/game.cache';
import { queryGames, queryGamesByArcadeId } from '~/server/db/game.queries';

export async function getGames(db: DB): Promise<Game[]> {
  return queryGames(db);
}

interface GetGamesByArcadeIdParams {
  db: DB;
  kv: KVNamespace;
  arcadeId: number;
}

export async function getGamesByArcadeId(
  { db, kv, arcadeId }: GetGamesByArcadeIdParams,
): Promise<Game[]> {
  const cached = await getCachedGamesByArcadeId(kv, arcadeId);
  if (cached)
    return cached;

  const games = await queryGamesByArcadeId(db, arcadeId);
  await setCachedGamesByArcadeId(kv, arcadeId, games);
  return games;
}
