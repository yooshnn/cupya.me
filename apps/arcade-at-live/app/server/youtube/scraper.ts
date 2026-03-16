import type { LiveStreamInfo } from './types';
import { extractVideoRenderers, extractYtInitialData, isLiveRenderer, resolveTitle } from './parser';

/**
 * Collects a list of active live streams for a single channel.
 * @param channelId The YouTube channel ID
 * @returns An array of LiveStreamInfo objects, or null if scraping failed
 */
export async function getLiveStreamsFromChannel(channelId: string): Promise<LiveStreamInfo[] | null> {
  try {
    const html = await fetchChannelFeaturedPage(channelId);

    // Parse
    const data = extractYtInitialData(html);
    if (!data) {
      console.warn(`[Scraper] Failed to extract ytInitialData from ${channelId}`);
      return null;
    }

    // Extract
    const renderers = extractVideoRenderers(data);
    const liveStreams = new Map<string, LiveStreamInfo>();

    // Process & Filter
    for (const r of renderers) {
      if (!r?.videoId || !isLiveRenderer(r)) {
        continue;
      }

      if (liveStreams.has(r.videoId)) {
        continue;
      }

      // Map to Domain Type
      liveStreams.set(r.videoId, {
        videoId: r.videoId,
        title: resolveTitle(r),
        embedUrl: buildEmbedUrl(r.videoId),
      });
    }

    return [...liveStreams.values()];
  }
  catch (error) {
    console.error(`Error scraping channel ${channelId}:`, error);
    return null;
  }
}

/**
 * Collects live streams from multiple channels in parallel.
 * @param channelIds An array of YouTube channel IDs
 * @returns A flattened array of LiveStreamInfo objects, or null if any scraper fails
 */
export async function getLiveStreamsFromChannels(channelIds: string[]): Promise<LiveStreamInfo[] | null> {
  const results = await Promise.all(channelIds.map(getLiveStreamsFromChannel));

  // If any channel failed to scrape, we return null to prevent poisoning the cache
  // with partial data or empty arrays.
  if (results.includes(null)) {
    return null;
  }

  return (results as LiveStreamInfo[][]).flat();
}

/**
 * Fetches the raw HTML of the target YouTube channel's featured page.
 * Includes user-agent headers to ensure consistent desktop routing.
 * @param channelId The YouTube channel ID
 * @returns The fetched HTML string
 */
async function fetchChannelFeaturedPage(channelId: string): Promise<string> {
  const url = `https://www.youtube.com/channel/${channelId}/featured`;
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch channel ${channelId}: ${response.status}`);
  }

  return response.text();
}

/**
 * Generates a YouTube embed player URL based on the provided video ID.
 * Includes viewer optimization parameters like autoplay, mute, and hidden controls.
 * @param videoId The YouTube video ID
 * @returns The constructed embed URL string
 */
function buildEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    disablekb: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params}`;
}
