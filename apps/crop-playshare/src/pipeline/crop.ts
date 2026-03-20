import type { DetectResult, ProcessMode } from './types';
import { RESULT_RATIO } from './types';

export async function crop(
  source: OffscreenCanvas,
  result: DetectResult,
  mode: ProcessMode,
): Promise<OffscreenCanvas> {
  const { top, bottom, width } = result;
  const resultHeight = bottom - top;

  const sx = mode === 'result-only'
    ? Math.round(width * RESULT_RATIO.userInfoWidth)
    : 0;
  const sy = top;
  const sw = width - sx;
  const sh = resultHeight;

  const canvas = new OffscreenCanvas(sw, sh);
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('Failed to get canvas context');

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas;
}
