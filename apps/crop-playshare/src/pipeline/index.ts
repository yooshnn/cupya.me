import type { ProcessMode } from './types';
import { crop } from './crop';
import { detect } from './detect';
import { downscaleIfNeeded } from './downscale';
import { applyPrivacyMask } from './privacy';

const OUTPUT_FORMAT = 'image/webp';
const OUTPUT_QUALITY = 0.9;

export async function process(
  file: File,
  mode: ProcessMode,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error('Failed to get canvas context');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = detect(imageData.data, canvas.width, canvas.height);

  const cropped = await crop(canvas, result, mode);

  const final = mode === 'privacy'
    ? await applyPrivacyMask(cropped)
    : cropped;

  return downscaleIfNeeded(final).convertToBlob({ type: OUTPUT_FORMAT, quality: OUTPUT_QUALITY });
}
