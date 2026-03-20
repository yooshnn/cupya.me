import type { ProcessMode } from './types';
import { applyPrivacyBlur } from './blur';
import { crop } from './crop';
import { detect } from './detect';

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
    const blurred = await applyPrivacyBlur(cropped);
    return blurred.convertToBlob({ type: 'image/png' });
  }

  return cropped.convertToBlob({ type: 'image/png' });
}
