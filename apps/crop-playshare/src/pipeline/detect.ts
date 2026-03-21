import type { DetectResult } from './types';
import { RESULT_RATIO } from './types';

const SAMPLE_COUNT = 16;
const VARIANCE_THRESHOLD = 80;
const calcMinContentRows = (height: number) => Math.round(height * 0.10);

function rowVariance(
  data: Uint8ClampedArray,
  y: number,
  width: number,
): number {
  const step = Math.floor(width / SAMPLE_COUNT);
  const brightness: number[] = [];

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const idx = (y * width + i * step) * 4;
    brightness.push(
      data[idx]! * 0.299
      + data[idx + 1]! * 0.587
      + data[idx + 2]! * 0.114,
    );
  }

  const mean = brightness.reduce((a, b) => a + b) / SAMPLE_COUNT;
  return brightness.reduce((a, b) => a + (b - mean) ** 2, 0) / SAMPLE_COUNT;
}

function isBackgroundRow(
  data: Uint8ClampedArray,
  y: number,
  width: number,
): boolean {
  return rowVariance(data, y, width) < VARIANCE_THRESHOLD;
}

export function detect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): DetectResult | null {
  let top = -1;
  let consecutive = 0;
  const MIN_CONTENT_ROWS = calcMinContentRows(height);

  for (let y = 0; y < height; y++) {
    if (!isBackgroundRow(data, y, width)) {
      consecutive++;
      if (consecutive >= MIN_CONTENT_ROWS && top === -1) {
        top = y - MIN_CONTENT_ROWS + 1;
      }
    }
    else {
      consecutive = 0;
    }
    if (top !== -1)
      break;
  }

  if (top === -1)
    return null;

  const bottom = Math.min(
    top + Math.round(width * RESULT_RATIO.aspectRatio),
    height,
  );

  return { top, bottom, width };
}
