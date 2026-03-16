import type { LiveStreamInfo } from '../youtube';
import { createCache } from './utils';

const TTL = 60 * 60 * 12; // 12h

export interface StreamCacheData {
  timestamp: number;
  streams: LiveStreamInfo[];
}

export const YouTubeStreamsCache = createCache<StreamCacheData>((arcadeId: number) => `youtube:streams:v2:${arcadeId}`, TTL);

export const getCachedStreams = (kv: KVNamespace, arcadeId: number) => YouTubeStreamsCache.get(kv, arcadeId);
export const setCachedStreams = (kv: KVNamespace, arcadeId: number, data: StreamCacheData) => YouTubeStreamsCache.set(kv, data, arcadeId);
export const invalidateCachedStreams = (kv: KVNamespace, arcadeId: number) => YouTubeStreamsCache.invalidate(kv, arcadeId);
