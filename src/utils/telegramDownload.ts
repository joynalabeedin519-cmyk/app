/**
 * Telegram WebApp & Mobile-safe file download / share utility
 * 
 * In Telegram Mini Apps (iOS, Android, Desktop WebView), typical <a download>
 * links fail because the iframe sandbox blocks download attribute triggering.
 * 
 * Solutions implemented here:
 * 1. Web Share API (navigator.share with File): Supported in Telegram mobile webview and mobile browsers.
 *    Directly opens native OS share sheet (Save Image to Gallery / Files / Share to Chat).
 * 2. Telegram WebApp API: Checks window.Telegram?.WebApp.downloadFile if Bot API 8+ is available.
 * 3. Fallback: Creates blob and object URL with download anchor.
 * 4. In Telegram fallback modal: Display a popup previewing the full image so users can
 *    tap & hold "Save Image" / "Download Image" directly inside Telegram.
 */

export interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: any;
  version?: string;
  platform?: string;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  downloadFile?: (params: { url: string; file_name: string }) => void;
  showPopup?: (params: { title?: string; message: string; buttons?: Array<{ type?: string; text: string }> }, callback?: (buttonId: string) => void) => void;
  showAlert?: (message: string, callback?: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function isTelegramMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.Telegram?.WebApp?.initData ||
    window.Telegram?.WebApp?.platform ||
    /Telegram|TgClient/i.test(navigator.userAgent) ||
    window.location.hash.includes('tgWebAppData')
  );
}

/**
 * Downloads or shares canvas image safely across Desktop, Mobile, and Telegram WebApp.
 * Returns { success: boolean; method: string; previewFallbackUrl?: string }
 */
export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  fileName: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<{ success: boolean; method: string; previewFallbackUrl?: string; message?: string }> {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const fullFileName = fileName.endsWith(`.${format}`) ? fileName : `${fileName}.${format}`;

  // 1. Convert canvas to blob
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, 0.95);
  });

  if (!blob) {
    throw new Error('Canvas blob generation failed');
  }

  // 2. If running inside Telegram Mini App
  const isTg = isTelegramMiniApp();

  // Try Web Share API with files (Supported in iOS/Android Telegram Webview!)
  // This allows direct "Save Image to Camera Roll / Photos" or forwarding!
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], fullFileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fullFileName,
          text: 'Cyber Sentinel Poster Studio',
        });
        return { success: true, method: 'share', message: 'সফলভাবে শেয়ার ও সেভ সম্পন্ন হয়েছে!' };
      }
    } catch (shareErr: any) {
      // User cancelled share dialog is not an error
      if (shareErr.name === 'AbortError') {
        return { success: true, method: 'cancelled', message: 'শেয়ার বাতিল করা হয়েছে' };
      }
      console.warn('Navigator share with file failed, falling back:', shareErr);
    }
  }

  // Check Telegram WebApp downloadFile API (Bot API 8+)
  if (window.Telegram?.WebApp?.downloadFile) {
    try {
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      window.Telegram.WebApp.downloadFile({
        url: dataUrl,
        file_name: fullFileName,
      });
      return { success: true, method: 'telegram_api', message: 'টেলিগ্রাম ডাউনলোড শুরু হয়েছে!' };
    } catch (tgErr) {
      console.warn('Telegram downloadFile API failed:', tgErr);
    }
  }

  // Standard Web Download using <a> element with ObjectURL
  try {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fullFileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Keep blob URL alive briefly before revoking
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 45000);

    // If in Telegram and we got here, Telegram might block the silent <a> click.
    // Return the previewFallbackUrl so a visual tap-and-save modal can be displayed!
    if (isTg) {
      const previewDataUrl = canvas.toDataURL(mimeType, 0.95);
      return {
        success: true,
        method: 'telegram_preview',
        previewFallbackUrl: previewDataUrl,
        message: 'টেলিগ্রাম অ্যাপের জন্য ছবি নিচে ওপেন হয়েছে, ছবিতে চাপ দিয়ে ধরে সেভ করুন!',
      };
    }

    return { success: true, method: 'browser_download', message: 'পোস্টার সফলভাবে ডাউনলোড হয়েছে!' };
  } catch (err: any) {
    console.error('Download link trigger failed:', err);
    // As last resort, return dataUrl for user to save
    const dataUrl = canvas.toDataURL(mimeType, 0.95);
    return {
      success: true,
      method: 'data_url_preview',
      previewFallbackUrl: dataUrl,
      message: 'ছবিতে চাপ দিয়ে ধরে (Tap and hold) আপনার ডিভাইসে সেভ করুন।',
    };
  }
}
