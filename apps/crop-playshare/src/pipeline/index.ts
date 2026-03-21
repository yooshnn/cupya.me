import type { ProcessMode } from './types';
import { applyPrivacyMask } from './blur';
import { crop } from './crop';
import { detect } from './detect';

const OUTPUT_FORMAT = 'image/webp';
const OUTPUT_QUALITY = 0.9;
const MAX_WIDTH = 1440;

function downscaleIfNeeded(canvas: OffscreenCanvas): OffscreenCanvas {
  if (canvas.width <= MAX_WIDTH)
    return canvas;
  const scale = MAX_WIDTH / canvas.width;
  const scaled = new OffscreenCanvas(MAX_WIDTH, Math.round(canvas.height * scale));
  const ctx = scaled.getContext('2d')!;
  ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
}

export async function process(
  file: File,
  mode: ProcessMode,
): Promise<Blob> {
  // File → ImageBitmap → OffscreenCanvas
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('Failed to get canvas context');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  // Detect
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = detect(imageData.data, canvas.width, canvas.height);
  if (!result)
    throw new Error('Failed to detect result area');

  // Crop
  const cropped = await crop(canvas, result, mode);

  // Blur (if privacy mode)
  if (mode === 'privacy') {
    const blurred = await applyPrivacyMask(cropped);
    return downscaleIfNeeded(blurred).convertToBlob({ type: OUTPUT_FORMAT, quality: OUTPUT_QUALITY });
  }

  return downscaleIfNeeded(cropped).convertToBlob({ type: OUTPUT_FORMAT, quality: OUTPUT_QUALITY });
}
