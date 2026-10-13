import {
  getCanvasBlobAndDataUrl,
  triggerDirectDownload,
  copyCanvasImageToClipboard,
  sharePosterImage,
  isMobileOrTelegram,
} from './downloadAndCopy';

export {
  getCanvasBlobAndDataUrl,
  triggerDirectDownload,
  copyCanvasImageToClipboard,
  sharePosterImage,
  isMobileOrTelegram,
};

export function isTelegramMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    Boolean((window as any).Telegram?.WebApp?.initData) ||
    /Telegram|TgClient/i.test(navigator.userAgent) ||
    window.location.hash.includes('tgWebAppData')
  );
}

export function isMobileDevice(): boolean {
  return isMobileOrTelegram();
}

export interface DownloadResult {
  success: boolean;
  method: 'direct' | 'share' | 'preview' | 'cancelled';
  previewFallbackUrl?: string;
  message: string;
}

/**
 * Clean, reset, and streamlined download canvas image implementation
 */
export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  fileName: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<DownloadResult> {
  try {
    const { blob, dataUrl } = await getCanvasBlobAndDataUrl(canvas, format, 0.98);
    const fullFileName = fileName.endsWith(`.${format}`) ? fileName : `${fileName}.${format}`;

    // Trigger download
    triggerDirectDownload(dataUrl, fullFileName);

    return {
      success: true,
      method: 'direct',
      previewFallbackUrl: dataUrl,
      message: '✓ পোস্টার তৈরি হয়েছে! ডাউনলোড বা সেভ করুন',
    };
  } catch (err) {
    console.error('Download error:', err);
    const fallbackUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png');
    return {
      success: true,
      method: 'preview',
      previewFallbackUrl: fallbackUrl,
      message: 'পোস্টার তৈরি হয়েছে! নিচের উইন্ডো থেকে সেভ বা কপি করুন।',
    };
  }
}
