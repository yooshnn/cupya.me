import { afterEach, describe, expect, it, vi } from 'vitest';
import { createYouTubeApiLiveStreamCollector } from './api';

describe('createYouTubeApiLiveStreamCollector', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps successful live search responses to live stream info', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse({
      items: [
        { id: { videoId: 'abc123' }, snippet: { title: 'Live title' } },
      ],
    }));
    vi.stubGlobal('fetch', fetch);

    const collector = createYouTubeApiLiveStreamCollector({ apiKey: 'api-key' });

    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toEqual([
      {
        videoId: 'abc123',
        title: 'Live title',
        embedUrl: 'https://www.youtube.com/embed/abc123?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1',
      },
    ]);

    expect(fetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=channel-id&eventType=live&type=video&maxResults=50&key=api-key',
    );
  });

  it('returns an empty array for a successful empty API result', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ items: [] })));

    const collector = createYouTubeApiLiveStreamCollector({ apiKey: 'api-key' });

    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toEqual([]);
  });

  it('returns null when the API key is missing', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    const collector = createYouTubeApiLiveStreamCollector({});

    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns null for HTTP failures, API errors, and malformed responses', async () => {
    const collector = createYouTubeApiLiveStreamCollector({ apiKey: 'api-key' });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 500)));
    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toBeNull();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ error: { message: 'quota' } })));
    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toBeNull();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({})));
    await expect(collector.getLiveStreamsFromChannel('channel-id')).resolves.toBeNull();
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
