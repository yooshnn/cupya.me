import type { StreamRule } from '~/server/db/schema';
import type { LiveStreamInfo } from '~/server/youtube/types';
import { describe, expect, it } from 'vitest';
import { matchStreams } from './stream.server';

describe('matchStreams', () => {
  it('matches stream titles after decoding HTML entities', () => {
    const streams: LiveStreamInfo[] = [{
      videoId: 'video-id',
      title: '[pop&#39;n PPM] [No.4-D] KR LIVE',
      embedUrl: 'https://www.youtube.com/embed/video-id',
    }];

    const rules: StreamRule[] = [{
      id: 30,
      arcade_id: 1,
      game_id: 11,
      keyword: '[pop\'n PPM] [No.4',
      machine_label: '4',
      priority: 0,
      created_at: '2026-03-08 11:45:16',
    }];

    expect(matchStreams(streams, rules)).toEqual([{
      ...streams[0],
      gameId: 11,
      machineLabel: '4',
    }]);
  });
});
