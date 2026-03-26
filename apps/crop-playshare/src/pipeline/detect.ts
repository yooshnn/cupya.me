import type { DetectResult } from './types';
import { POPN_RESULT_RATIO } from './types';

// Evenly spaced samples per row for variance estimation.
const SAMPLE_COUNT = 16;

// The e-amusement app background is plain grey, so its variance is low.
// Result screens are colorful and reliably exceed this threshold.
const VARIANCE_THRESHOLD = 80;

// Number of consecutive background rows required to confirm a boundary.
// Filters out noise like thin UI separator lines.
const BOUNDARY_ROWS = 16;

// Reusable buffer — avoids per-row array allocation during scanning.
const brightnessBuffer = new Float32Array(SAMPLE_COUNT);

function rowVariance(
  data: Uint8ClampedArray,
  y: number,
  width: number,
): number {
  const step = Math.floor(width / SAMPLE_COUNT);
  let sum = 0;

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const idx = (y * width + i * step) * 4;
    const b = (data[idx]! + data[idx + 1]! + data[idx + 2]!) / 3;
    brightnessBuffer[i] = b;
    sum += b;
  }

  const mean = sum / SAMPLE_COUNT;
  let variance = 0;
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const diff = brightnessBuffer[i]! - mean;
    variance += diff * diff;
  }
  return variance / SAMPLE_COUNT;
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
 * The center of the screen always falls inside the result area,
 * so scanning upward from there finds the top boundary without being
 * affected by the app's grey letterbox above or below.
 *
 * Stops when BOUNDARY_ROWS consecutive background rows are found.
 * Falls back to top=0 if no boundary is detected.
 */
export function detect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): DetectResult {
  const centerY = Math.floor(height / 2);
  let consecutiveBg = 0;
  let top = 0;
  let found = false;

  for (let y = centerY; y >= 0; y--) {
    if (isBackgroundRow(data, y, width)) {
      consecutiveBg++;
      if (consecutiveBg >= BOUNDARY_ROWS) {
        top = y + BOUNDARY_ROWS;
        found = true;
        break;
      }
    }
    else {
      consecutiveBg = 0;
    }
  }

  if (!found) {
    console.warn('[detect] Could not find top boundary; falling back to top=0.');
  }

  const bottom = Math.min(
    top + Math.round(width * POPN_RESULT_RATIO.heightRatio),
    height,
  );

  // Trim the boundary row itself (contains background pixels),
  // clamped to stay within image bounds.
  return {
    top: Math.min(top + 1, height - 1),
    bottom: Math.max(bottom - 1, 0),
    width,
  };
}
