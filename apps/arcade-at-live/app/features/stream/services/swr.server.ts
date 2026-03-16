import type { LiveStreamInfo } from '~/server/youtube';
import { getCachedStreams, setCachedStreams } from '~/server/cache/stream.cache';
import { getLiveStreamsFromChannels } from '~/server/youtube';

const STALE_TIME_MS = 10 * 60 * 1000; // 10m

async function fetchAndCacheStreams(
  kv: KVNamespace,
  arcadeId: number,
  youtubeChannelIds: string[],
  oldStreams?: LiveStreamInfo[],
): Promise<{ streams: LiveStreamInfo[] | null; timestamp: number }> {
  const fetchedStreams = await getLiveStreamsFromChannels(youtubeChannelIds);
  const now = Date.now();

  if (fetchedStreams) {
    await setCachedStreams(kv, arcadeId, { timestamp: now, streams: fetchedStreams });
  }
  else if (oldStreams) {
    // update the timestamp to prevent retry loops
    await setCachedStreams(kv, arcadeId, { timestamp: now, streams: oldStreams });
  }

  return { streams: fetchedStreams, timestamp: now };
}

interface GetLiveStreamsSWRParams {
  kv: KVNamespace;
  ctx: ExecutionContext;
  arcadeId: number;
  channelIds: string[];
}

export interface SWRFetchResult {
  streams: LiveStreamInfo[] | null;
  scrapeFailed: boolean;
  timestamp: number;
}

export async function getLiveStreamsWithSWR(
  { kv, ctx, arcadeId, channelIds }: GetLiveStreamsSWRParams,
): Promise<SWRFetchResult> {
  const now = Date.now();
  const cacheData = await getCachedStreams(kv, arcadeId);

  // Cache hit
  if (cacheData) {
    const isCacheStale = now - cacheData.timestamp > STALE_TIME_MS;

    if (isCacheStale) {
      // Update the timestamp early to stop other users from triggering the scrape at the same time
      ctx.waitUntil(setCachedStreams(kv, arcadeId, { timestamp: now, streams: cacheData.streams }).catch(() => {}));

      ctx.waitUntil(
        fetchAndCacheStreams(kv, arcadeId, channelIds, cacheData.streams).catch((err) => {
          console.error('Background cache update failed:', err);
        }),
      );
    }

    return { ...cacheData, scrapeFailed: false };
  }

  // Cache miss
  const { streams, timestamp } = await fetchAndCacheStreams(kv, arcadeId, channelIds);

  return {
    streams,
    timestamp,
    scrapeFailed: !streams,
  };
}
