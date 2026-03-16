import type { MatchedStream } from '../services/types';
import type { Game } from '~/server/db/schema';
import type { TabItem } from '~/shared/ui/tabs';
import { useNavigate, useSearchParams } from 'react-router';

/**
 * Manages game tabs state, parsing the active game from URL search parameters,
 * and generating the tab items data and navigation handler.
 *
 * @param games List of available games.
 * @param streams List of all streams associated with the arcade.
 * @returns Object containing tab items data, active game ID, and selection handler.
 */
export function useGameTabs(games: Game[], streams: MatchedStream[]) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const countByGameId = buildStreamCountByGameId(streams);
  const activeGameId = resolveActiveGameId(games, searchParams.get('game'), countByGameId);
  const tabItems = buildGameTabItems(games, countByGameId);

  function handleSelect(key: string | number) {
    const game = games.find(g => g.id === key);
    if (game) {
      navigate(`?game=${game.slug}`);
    }
  }

  return {
    tabItems,
    activeGameId,
    handleSelect,
  };
}

// Public helpers

/**
 * Filters the given list of streams by a specific game ID.
 *
 * @param streams List of all streams associated with the arcade.
 * @param gameId The ID of the game to filter streams by.
 * @returns Array of streams belonging to the specified game ID.
 */
export function filterStreamsByGameId(
  streams: MatchedStream[],
  gameId: number | null,
) {
  return streams
    .filter(stream => stream.gameId === gameId)
    .sort((a, b) => {
      const labelA = a.machineLabel || '';
      const labelB = b.machineLabel || '';
      return labelA.localeCompare(labelB, undefined, { numeric: true });
    });
}

// Private helpers

function resolveActiveGameId(
  games: Game[],
  slug: string | null,
  countByGameId: Map<number, number>,
): number | null {
  const fallback = games[0]?.id;
  if (!fallback)
    return null;

  if (slug) {
    const found = games.find(g => g.slug === slug);
    if (found) {
      return found.id;
    }
  }

  const firstGameWithStreams = games.find(g => countByGameId.has(g.id));
  return firstGameWithStreams ? firstGameWithStreams.id : fallback;
}

function buildStreamCountByGameId(streams: MatchedStream[]): Map<number, number> {
  const countByGameId = new Map<number, number>();

  for (const { gameId } of streams) {
    countByGameId.set(gameId, (countByGameId.get(gameId) ?? 0) + 1);
  }

  return countByGameId;
}

function buildGameTabItems(
  games: Game[],
  countByGameId: Map<number, number>,
): TabItem[] {
  const items = games.map(game => ({
    key: game.id,
    label: game.alias,
    badge: countByGameId.get(game.id) ?? undefined,
  }));

  return items.sort((a, b) => {
    const aHasStreams = a.badge !== undefined;
    const bHasStreams = b.badge !== undefined;

    if (aHasStreams && !bHasStreams) {
      return -1;
    }
    if (!aHasStreams && bHasStreams) {
      return 1;
    }
    return 0;
  });
}
