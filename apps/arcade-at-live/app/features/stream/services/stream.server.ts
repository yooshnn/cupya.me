import type { MatchedStream } from './types';
import type { DB } from '~/server/db/client';
import type { StreamRule } from '~/server/db/schema';
import type { LiveStreamInfo } from '~/server/youtube/types';
import { getChannelsByArcadeId, getStreamRulesByArcadeId } from '~/features/arcade/arcade.server';
import { getLiveStreamsWithSWR } from './swr.server';

interface GetActiveStreamsByArcadeIdParams {
  db: DB;
  kv: KVNamespace;
  ctx: ExecutionContext;
  arcadeId: number;
}

export interface ActiveStreamsResult {
  streams: MatchedStream[];
  scrapeFailed: boolean;
  timestamp: number;
}

export async function getActiveStreamsByArcadeId(
  { db, kv, ctx, arcadeId }: GetActiveStreamsByArcadeIdParams,
): Promise<ActiveStreamsResult> {
  const [channels, rules] = await Promise.all([
    getChannelsByArcadeId(db, kv, arcadeId),
    getStreamRulesByArcadeId(db, kv, arcadeId),
  ]);

  const { streams, scrapeFailed, timestamp } = await getLiveStreamsWithSWR({
    kv,
    ctx,
    arcadeId,
    channelIds: channels.map(c => c.youtube_channel_id),
  });

  console.log(matchStreams(streams ?? [], rules));

  return {
    streams: matchStreams(streams ?? [], rules),
    scrapeFailed,
    timestamp,
  };
}

// Private helpers

export function matchStreams(
  streams: LiveStreamInfo[],
  rules: StreamRule[],
): MatchedStream[] {
  console.log(rules);
  // priority ASC order is guaranteed by queryStreamRulesByArcadeId
  return streams.flatMap((stream) => {
    const rule = rules.find(r => stream.title.includes(r.keyword));
    return rule ? [{ ...stream, gameId: rule.game_id, machineLabel: rule.machine_label }] : [];
  });
}
