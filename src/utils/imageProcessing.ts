/**
 * In-browser Background Removal & Watermark Processing Utility.
 * Removes outer white borders, dark backgrounds, or extracts transparent watermarks from logos.
 */

export interface BackgroundRemovalOptions {
  removeOuterWhite: boolean; // Clears white borders/corners outside the emblem
  removeDarkBackground: boolean; // Makes dark/black pixels transparent
  darkThreshold: number; // 0 to 100, default 35
  whiteThreshold: number; // 200 to 255, default 240
  clipToCircle: boolean; // Automatically crops to circular boundary
  featherEdges: boolean; // Softens edge transitions
}

export const DEFAULT_BG_OPTIONS: BackgroundRemovalOptions = {
  removeOuterWhite: true,
  removeDarkBackground: false,
  darkThreshold: 30,
  whiteThreshold: 235,
  clipToCircle: true,
  featherEdges: true,
};

/**
 * Removes background from an image using HTML5 Canvas pixel manipulation.
 * Returns a transparent PNG Data URL.
 */
export function processLogoBackground(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  options: Partial<BackgroundRemovalOptions> = {}
): string {
  const opts = { ...DEFAULT_BG_OPTIONS, ...options };
  const width = imageSource.width;
  const height = imageSource.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  ctx.drawImage(imageSource, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 2;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);

    // Distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 1. Remove outer pixels if clipping to circle or removing outer white
    if (opts.clipToCircle && dist > radius) {
      data[i + 3] = 0;
      continue;
    }

    // 2. Remove white corners / borders
    if (opts.removeOuterWhite) {
      if (r >= opts.whiteThreshold && g >= opts.whiteThreshold && b >= opts.whiteThreshold) {
        data[i + 3] = 0;
        continue;
      }
    }

    // 3. Remove dark background inside the logo (turn black/dark background transparent)
    if (opts.removeDarkBackground) {
      // Calculate luminance / maximum RGB
      const maxChannel = Math.max(r, g, b);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Check if pixel is dark black/gray background
      if (maxChannel < opts.darkThreshold * 2.55) {
        // Pixel is in dark background range
        const fadeRange = 25;
        const diff = opts.darkThreshold * 2.55 - maxChannel;
        if (diff > fadeRange) {
          data[i + 3] = 0;
        } else {
          // Smooth feather edge
          const factor = (fadeRange - diff) / fadeRange;
          data[i + 3] = Math.round(a * factor);
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
