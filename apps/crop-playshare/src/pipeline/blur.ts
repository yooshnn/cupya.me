import { RESULT_RATIO } from './types';

export async function applyPrivacyMask(
  source: OffscreenCanvas,
): Promise<OffscreenCanvas> {
  const { width, height } = source;
  const maskW = Math.round(width * RESULT_RATIO.userInfoWidth);
  const maskH = Math.round(height * RESULT_RATIO.cardnameHeight);
  const pad = 2;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, pad, maskW - pad, maskH - pad);

  return canvas;
}
