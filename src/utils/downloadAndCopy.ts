/**
 * Fresh Universal Poster Downloader & Clipboard Engine
 * Designed specifically for:
 * - Telegram Mini App & In-App WebViews
 * - Mobile Browsers (Android, iOS, Google Photos, Gallery)
 * - Desktop / PC browsers (Windows, Mac, Linux)
 */

export interface DownloadOptions {
  fileName: string;
  format?: 'png' | 'jpeg';
  resolution?: number;
}

export interface ExportResult {
  dataUrl: string;
  blob: Blob;
  fileName: string;
  downloadTriggered: boolean;
  message: string;
}

/**
 * Checks if current browser/device is a mobile device or touch-focused webview
 */
export function isMobileOrTelegram(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isTg =
    Boolean((window as any).Telegram?.WebApp?.initData) ||
    /Telegram|TgClient/i.test(ua) ||
    window.location.hash.includes('tgWebAppData');
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return isTg || isMobileUA || (isTouch && window.innerWidth <= 820);
}

/**
 * Converts canvas to high-res Blob and Data URL
 */
export async function getCanvasBlobAndDataUrl(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.98
): Promise<{ blob: Blob; dataUrl: string }> {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality);
  });

  if (!blob) {
    throw new Error('Canvas blob generation failed');
  }

  const dataUrl = canvas.toDataURL(mimeType, quality);
  return { blob, dataUrl };
}

/**
 * Triggers standard browser file download
 */
export function triggerDirectDownload(dataUrlOrBlobUrl: string, fileName: string): boolean {
  try {
    const link = document.createElement('a');
    link.href = dataUrlOrBlobUrl;
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.warn('Direct link download trigger error:', err);
    return false;
  }
}

/**
 * Copies canvas image directly to system clipboard as real PNG image
 */
export async function copyCanvasImageToClipboard(
  canvas: HTMLCanvasElement
): Promise<{ success: boolean; method: 'image' | 'text' | 'failed'; message: string }> {
  try {
    const { blob } = await getCanvasBlobAndDataUrl(canvas, 'png');

    // Modern Clipboard API with image/png blob
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return {
          success: true,
          method: 'image',
          message: '✓ পোস্টার ছবি কপি হয়েছে! টেলিগ্রাম, মেসেঞ্জার বা ফেসবুকে পেস্ট করুন।',
        };
      } catch (clipErr) {
        console.warn('ClipboardItem write failed, trying fallback:', clipErr);
      }
    }

    // Fallback: Copy as data URL text
    if (navigator.clipboard && navigator.clipboard.writeText) {
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      await navigator.clipboard.writeText(dataUrl);
      return {
        success: true,
        method: 'text',
        message: '✓ ছবির লিঙ্ক কপি হয়েছে! যেকোনো চ্যাটে পেস্ট করতে পারেন।',
      };
    }

    return {
      success: false,
      method: 'failed',
      message: 'কপি করা যায়নি। নিচের ছবির উপর চেপে ধরে (Long Press) কপি করুন।',
    };
  } catch (err) {
    console.error('Error copying to clipboard:', err);
    return {
      success: false,
      method: 'failed',
      message: 'কপি করা যায়নি। নিচের ছবির উপর চেপে ধরে (Long Press) কপি করুন।',
    };
  }
}

/**
 * Shares image using Web Share API (Save to Google Photos / Gallery / Files)
 */
export async function sharePosterImage(
  blob: Blob,
  fileName: string,
  title: string = 'Cyber Sentinel Poster'
): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], fileName, { type: blob.type || 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `${title} - গুগল ফটো বা গ্যালারিতে সেভ করুন`,
        });
        return true;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return false;
      console.warn('Web Share failed:', err);
    }
  }
  return false;
}
