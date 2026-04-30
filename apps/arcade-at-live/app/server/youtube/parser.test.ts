import type { YtVideoRenderer } from './types';
import { describe, expect, it } from 'vitest';
import { isLiveRenderer } from './parser';

describe('isLiveRenderer', () => {
  it('accepts active live renderers', () => {
    expect(isLiveRenderer({
      videoId: 'video-id',
      badges: [{ metadataBadgeRenderer: { style: 'BADGE_STYLE_TYPE_LIVE_NOW' } }],
    })).toBe(true);
  });

  it('rejects upcoming live renderers', () => {
    const renderer: YtVideoRenderer = {
      videoId: 'video-id',
      badges: [{ metadataBadgeRenderer: { style: 'BADGE_STYLE_TYPE_LIVE_NOW' } }],
      thumbnailOverlays: [{ thumbnailOverlayTimeStatusRenderer: { style: 'UPCOMING' } }],
    };

    expect(isLiveRenderer(renderer)).toBe(false);
  });
});
