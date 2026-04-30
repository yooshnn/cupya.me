import type { LiveStreamInfo, YouTubeLiveStreamCollector } from './types';
import { buildEmbedUrl } from './utils';

interface YouTubeApiCollectorOptions {
  apiKey?: string;
}

interface YouTubeSearchListResponse {
  error?: unknown;
  items?: YouTubeSearchResultItem[];
}

interface YouTubeSearchResultItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
  };
}

export function createYouTubeApiLiveStreamCollector(
  { apiKey }: YouTubeApiCollectorOptions,
): YouTubeLiveStreamCollector {
  return {
    async getLiveStreamsFromChannel(channelId: string): Promise<LiveStreamInfo[] | null> {
      if (!apiKey) {
        console.warn('[YouTube API] Missing YOUTUBE_API_KEY');
        return null;
      }

      try {
        const response = await fetch(buildSearchListUrl(channelId, apiKey));

        if (!response.ok) {
          console.warn(`[YouTube API] Failed to fetch live streams for ${channelId}: ${response.status}`);
          return null;
        }

        const data = await response.json<YouTubeSearchListResponse>();

        if (data.error) {
          console.warn(`[YouTube API] Response includes an error for ${channelId}`);
          return null;
        }

        if (!Array.isArray(data.items)) {
          console.warn(`[YouTube API] Malformed response for ${channelId}`);
          return null;
        }

        return data.items.flatMap((item) => {
          const videoId = item.id?.videoId;
          const title = item.snippet?.title;

          if (!videoId || !title) {
            return [];
          }

          return [{
            videoId,
            title,
            embedUrl: buildEmbedUrl(videoId),
          }];
        });
      }
      catch (error) {
        console.error(`[YouTube API] Error fetching live streams for ${channelId}:`, error);
        return null;
      }
    },
  };
}

function buildSearchListUrl(channelId: string, apiKey: string): string {
  const params = new URLSearchParams({
    part: 'snippet',
    channelId,
    eventType: 'live',
    type: 'video',
    maxResults: '50',
    key: apiKey,
  });

  return `https://www.googleapis.com/youtube/v3/search?${params}`;
}
