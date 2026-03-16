import type { YtInitialData, YtVideoRenderer } from './types';

const YT_INITIAL_DATA_REGEX = /var ytInitialData\s*=\s*(\{.+?\});\s*(?:var |window\.|<\/script>)/s;

/**
 * Extracts the ytInitialData JSON object from raw HTML string.
 * @param html The raw HTML string of a YouTube page
 * @returns The extracted ytInitialData object, or null if parsing fails
 */
export function extractYtInitialData(html: string): YtInitialData | null {
  const match = html.match(YT_INITIAL_DATA_REGEX);
  if (!match?.[1]) {
    return null;
  }

  try {
    return JSON.parse(match[1]) as YtInitialData;
  }
  catch {
    console.error('Failed to parse ytInitialData JSON');
    return null;
  }
}

/**
 * Extracts a list of valid YtVideoRenderers from ytInitialData.
 * Iterates through various sections of the Live and Home tabs (horizontal scrolls, recommendations, etc.).
 * @param data The parsed ytInitialData object
 * @returns An array of YtVideoRenderer objects
 */
export function extractVideoRenderers(data: YtInitialData): YtVideoRenderer[] {
  const renderers: YtVideoRenderer[] = [];
  const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];

  for (const tab of tabs) {
    const content = tab?.tabRenderer?.content;

    // Live tab (richGridRenderer)
    for (const item of content?.richGridRenderer?.contents ?? []) {
      const r = item?.richItemRenderer?.content?.videoRenderer;
      if (r) {
        renderers.push(r);
      }
    }

    // Home tab (sectionListRenderer)
    for (const section of content?.sectionListRenderer?.contents ?? []) {
      for (const sc of section?.itemSectionRenderer?.contents ?? []) {
        // Channel featured content (channelFeaturedContentRenderer)
        for (const item of sc?.channelFeaturedContentRenderer?.items ?? []) {
          if (item?.videoRenderer) {
            renderers.push(item.videoRenderer);
          }
        }
        // Horizontal scroll (shelfRenderer -> horizontalListRenderer)
        for (const item of sc?.shelfRenderer?.content?.horizontalListRenderer?.items ?? []) {
          if (item?.gridVideoRenderer) {
            renderers.push(item.gridVideoRenderer);
          }
        }
        // Expanded vertical list (shelfRenderer -> expandedShelfContentsRenderer)
        for (const item of sc?.shelfRenderer?.content?.expandedShelfContentsRenderer?.items ?? []) {
          if (item?.videoRenderer) {
            renderers.push(item.videoRenderer);
          }
        }
      }
    }
  }

  return renderers;
}

/**
 * Extracts and formats the display title from a YtVideoRenderer object.
 * @param r The YtVideoRenderer object
 * @returns The formatted title string
 */
export function resolveTitle(r: YtVideoRenderer): string {
  return (
    r.title?.runs?.map(run => run.text).join('')
    ?? r.title?.simpleText
    ?? ''
  );
}

/**
 * Determines whether a rendering item is an upcoming or premiered live broadcast.
 * @param r The YtVideoRenderer object
 * @returns True if the broadcast is upcoming
 */
export function isUpcoming(r: YtVideoRenderer): boolean {
  const isUpcomingOverlay = r.thumbnailOverlays?.some(o => o?.thumbnailOverlayTimeStatusRenderer?.style === 'UPCOMING') || false;

  const hasUpcomingText = r.viewCountText?.runs?.some((run) => {
    const text = run.text.toLowerCase();
    return text.includes('예정') || text.includes('대기 중') || text.includes('premiere') || text.includes('upcoming');
  }) || false;

  const hasUpcomingData = r.upcomingEventData !== undefined;

  return (isUpcomingOverlay || hasUpcomingText || hasUpcomingData);
}

/**
 * Determines whether the video is an actively ongoing live stream.
 * Distinguishes from upcoming streams, relying on "LIVE NOW" badges or concurrent viewer count text.
 * @param r The YtVideoRenderer object
 * @returns True if it is currently an active live broadcast
 */
export function isLiveRenderer(r: YtVideoRenderer): boolean {
  if (isUpcoming(r)) {
    return false;
  }

  // Indicators of an active stream
  const hasLiveBadge = r.badges?.some(b => b?.metadataBadgeRenderer?.style === 'BADGE_STYLE_TYPE_LIVE_NOW') || false;
  const hasLiveOverlay = r.thumbnailOverlays?.some(o => o?.thumbnailOverlayTimeStatusRenderer?.style === 'LIVE') || false;
  const hasWatchingText = r.viewCountText?.runs?.some((run) => {
    const text = run.text.toLowerCase();
    return text.includes('시청') || text.includes('watching');
  }) || false;

  return hasLiveBadge || hasLiveOverlay || hasWatchingText;
}
