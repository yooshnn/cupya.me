import type { LiveStreamInfo } from '~/server/youtube';

export interface MatchedStream extends LiveStreamInfo {
  gameId: number;
  machineLabel: string | null;
}
