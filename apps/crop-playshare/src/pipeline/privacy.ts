import { POPN_RESULT_RATIO } from './types';

export async function applyPrivacyMask(
  source: OffscreenCanvas,
): Promise<OffscreenCanvas> {
  const { width, height } = source;
  const maskW = Math.round(width * POPN_RESULT_RATIO.resultPanelOffset);
  const maskH = Math.round(height * POPN_RESULT_RATIO.privacyMaskHeight);
  const pad = 2;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, pad, maskW - pad, maskH - pad);

  return canvas;
}
