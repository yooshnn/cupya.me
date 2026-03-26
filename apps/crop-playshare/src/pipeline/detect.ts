import type { DetectResult } from './types';
import { POPN_RESULT_RATIO } from './types';

const SAMPLE_COUNT = 16;
const VARIANCE_THRESHOLD = 80;
/**
 * How many consecutive background rows must be seen before we consider
 * the boundary found. Guards against single-row artifacts (thin UI lines, etc.).
 */
const BOUNDARY_ROWS = 4;

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

/**
 * Detects the result area by scanning upward from the vertical center.
 *
 * Rationale: the result area always contains the center of the screen,
 * so scanning from the middle upward is robust against phone UI elements
 * (status bar, notch, bottom nav bar) that sit outside the result area.
 *
 * The scan stops as soon as it finds BOUNDARY_ROWS consecutive background
 * rows, treating the row just below them as the top of the result area.
 * If no boundary is found, top falls back to 0.
 */
export function detect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): DetectResult {
  const centerY = Math.floor(height / 2);
  let consecutiveBg = 0;
  let top = 0;

  for (let y = centerY; y >= 0; y--) {
    if (isBackgroundRow(data, y, width)) {
      consecutiveBg++;
      if (consecutiveBg >= BOUNDARY_ROWS) {
        top = y + BOUNDARY_ROWS;
        break;
      }
    }
    else {
      consecutiveBg = 0;
    }
  }

  const bottom = Math.min(
    top + Math.round(width * POPN_RESULT_RATIO.heightRatio),
    height,
  );

  return { top, bottom, width };
}
