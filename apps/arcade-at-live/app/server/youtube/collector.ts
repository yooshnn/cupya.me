import type { LiveStreamInfo, YouTubeLiveStreamCollector } from './types';
import { createYouTubeApiLiveStreamCollector } from './api';
import { scraperLiveStreamCollector } from './scraper';

export interface GetLiveStreamsOptions {
  apiKey?: string;
  primaryCollector?: YouTubeLiveStreamCollector;
  fallbackCollector?: YouTubeLiveStreamCollector;
}

/**
 * Collects a list of active live streams for a single channel.
 * Uses the YouTube Data API first and falls back to scraping only when the API
 * collector fails. A successful empty API response means there are no live streams.
 * @param channelId The YouTube channel ID
 * @param options Collector configuration
 * @returns An array of LiveStreamInfo objects, or null if every collector failed
 */
export async function getLiveStreamsFromChannel(
  channelId: string,
  options: GetLiveStreamsOptions = {},
): Promise<LiveStreamInfo[] | null> {
  const primaryCollector = options.primaryCollector ?? createYouTubeApiLiveStreamCollector({ apiKey: options.apiKey });
  const fallbackCollector = options.fallbackCollector ?? scraperLiveStreamCollector;

  const apiStreams = await primaryCollector.getLiveStreamsFromChannel(channelId);

  if (apiStreams !== null) {
    return apiStreams;
  }

  console.warn(`[YouTube Collector] Falling back to scraper for ${channelId}`);
  return fallbackCollector.getLiveStreamsFromChannel(channelId);
}

/**
 * Collects live streams from multiple channels in parallel.
 * @param channelIds An array of YouTube channel IDs
 * @param options Collector configuration
 * @returns A flattened array of LiveStreamInfo objects, or null if any channel fails
 */
export async function getLiveStreamsFromChannels(
  channelIds: string[],
  options: GetLiveStreamsOptions = {},
): Promise<LiveStreamInfo[] | null> {
  const results = await Promise.all(channelIds.map(channelId => getLiveStreamsFromChannel(channelId, options)));

  // If any channel failed to collect, we return null to prevent poisoning the cache
  // with partial data or empty arrays.
  if (results.includes(null)) {
    return null;
  }

  return (results as LiveStreamInfo[][]).flat();
}
