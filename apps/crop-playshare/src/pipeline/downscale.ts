// Prevent upscaling artifacts and oversized output files.
const MAX_WIDTH = 1440;

export function downscaleIfNeeded(canvas: OffscreenCanvas): OffscreenCanvas {
  if (canvas.width <= MAX_WIDTH)
    return canvas;
  const scale = MAX_WIDTH / canvas.width;
  const scaled = new OffscreenCanvas(MAX_WIDTH, Math.round(canvas.height * scale));
  scaled.getContext('2d')!.drawImage(canvas, 0, 0, scaled.width, scaled.height);
  return scaled;
}
