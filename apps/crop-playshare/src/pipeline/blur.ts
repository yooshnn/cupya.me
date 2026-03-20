import { RESULT_RATIO } from './types';

export async function applyPrivacyBlur(
  source: OffscreenCanvas,
): Promise<OffscreenCanvas> {
  const { width, height } = source;
  const blurW = Math.round(width * RESULT_RATIO.userInfoWidth);
  const blurH = Math.round(height * RESULT_RATIO.cardnameHeight);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const PIXEL_SIZE = 10;
  const tmpW = Math.ceil(blurW / PIXEL_SIZE);
  const tmpH = Math.ceil(blurH / PIXEL_SIZE);

  const tmp = new OffscreenCanvas(tmpW, tmpH);
  const tmpCtx = tmp.getContext('2d')!;
  tmpCtx.drawImage(source, 0, 0, blurW, blurH, 0, 0, tmpW, tmpH);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, 0, 0, tmpW, tmpH, 0, 0, blurW, blurH);

  return canvas;
}
