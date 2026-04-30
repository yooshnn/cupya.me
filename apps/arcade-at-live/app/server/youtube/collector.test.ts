import type { LiveStreamInfo, YouTubeLiveStreamCollector } from './types';
import { describe, expect, it, vi } from 'vitest';
import { getLiveStreamsFromChannel, getLiveStreamsFromChannels } from './collector';

const liveStream: LiveStreamInfo = {
  videoId: 'video-id',
  title: 'Live title',
  embedUrl: 'https://www.youtube.com/embed/video-id',
};

describe('getLiveStreamsFromChannel', () => {
  it('does not call the fallback collector when the API collector succeeds', async () => {
    const primaryCollector = collectorReturning([liveStream]);
    const fallbackCollector = collectorReturning(null);

    await expect(getLiveStreamsFromChannel('channel-id', { primaryCollector, fallbackCollector })).resolves.toEqual([liveStream]);

    expect(primaryCollector.getLiveStreamsFromChannel).toHaveBeenCalledWith('channel-id');
    expect(fallbackCollector.getLiveStreamsFromChannel).not.toHaveBeenCalled();
  });

  it('does not call the fallback collector when the API collector returns an empty result', async () => {
    const primaryCollector = collectorReturning([]);
    const fallbackCollector = collectorReturning([liveStream]);

    await expect(getLiveStreamsFromChannel('channel-id', { primaryCollector, fallbackCollector })).resolves.toEqual([]);

    expect(fallbackCollector.getLiveStreamsFromChannel).not.toHaveBeenCalled();
  });

  it('uses the fallback collector when the API collector fails', async () => {
    const primaryCollector = collectorReturning(null);
    const fallbackCollector = collectorReturning([liveStream]);

    await expect(getLiveStreamsFromChannel('channel-id', { primaryCollector, fallbackCollector })).resolves.toEqual([liveStream]);

    expect(fallbackCollector.getLiveStreamsFromChannel).toHaveBeenCalledWith('channel-id');
  });
});

describe('getLiveStreamsFromChannels', () => {
  it('returns null when a channel fails both collectors', async () => {
    const primaryCollector = collectorReturning(null);
    const fallbackCollector = collectorReturning(null);

    await expect(getLiveStreamsFromChannels(['channel-id'], { primaryCollector, fallbackCollector })).resolves.toBeNull();
  });
});

function collectorReturning(result: LiveStreamInfo[] | null): YouTubeLiveStreamCollector {
  return {
    getLiveStreamsFromChannel: vi.fn().mockResolvedValue(result),
  };
}
