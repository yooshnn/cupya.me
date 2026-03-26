import type { DetectResult, ProcessMode } from './types';
import { POPN_RESULT_RATIO } from './types';

export async function crop(
  source: OffscreenCanvas,
  result: DetectResult,
  mode: ProcessMode,
): Promise<OffscreenCanvas> {
  const { top, bottom, width } = result;

  const sx = mode === 'result-only'
    ? Math.round(width * POPN_RESULT_RATIO.resultPanelOffset)
    : 0;
  const sy = top;
  const sw = width - sx;
  const sh = bottom - top;

  const canvas = new OffscreenCanvas(sw, sh);
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('Failed to get canvas context');

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas;
}
