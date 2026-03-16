import type { DB } from './client';
import { asc, eq } from 'drizzle-orm';
import { games, stream_rules } from './schema';

export async function queryGames(db: DB) {
  return db.query.games.findMany({
    orderBy: asc(games.alias),
  });
}

export async function queryGamesByArcadeId(db: DB, arcadeId: number) {
  return db
    .selectDistinct({ game: games })
    .from(games)
    .innerJoin(stream_rules, eq(stream_rules.game_id, games.id))
    .where(eq(stream_rules.arcade_id, arcadeId))
    .orderBy(asc(games.alias))
    .then(rows => rows.map(r => r.game));
}
