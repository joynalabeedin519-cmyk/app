/**
 * Modern Universal Downloader & Saver:
 * 
 * 1. Desktop / PC:
 *    - Uses Native File System Access API (`window.showSaveFilePicker`) if supported
 *      (Chrome, Edge, Opera on Desktop). This displays the OS native "Save As" file menu dialog,
 *      letting the user choose exactly which folder / path to save the image to!
 *    - Fallback on Firefox/Safari Desktop: Creates a direct blob download link with file name prompt.
 *
 * 2. Mobile (Android / iOS / Google Photos):
 *    - Checks if running on mobile device (touch, screen width, user agent).
 *    - Uses Web Share API (`navigator.share` with file). On Android, this directly opens the
 *      system sheet showing "Save to Google Photos", "Save to device", "Gallery", "Files", Telegram, etc.
 *    - On Android Chrome, if direct download is triggered, also triggers automatic download to device Downloads/Pictures folder.
 *    - Also provides fallback modal preview so users can Tap & Hold to save directly into Photos.
 * 
 * 3. Telegram Mini App / In-App WebView:
 *    - Automatically handles Telegram webview restrictions, WebApp downloadFile if available,
 *      and opens the high-res tap-and-save sheet.
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
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: Array<{
        description: string;
        accept: Record<string, string[]>;
      }>;
    }) => Promise<FileSystemFileHandle>;
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

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTouchScreen = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const isNarrowScreen = window.innerWidth <= 768;
  return isMobileUA || (isTouchScreen && isNarrowScreen);
}

export interface DownloadResult {
  success: boolean;
  method: 'file_picker' | 'mobile_share' | 'mobile_auto_save' | 'telegram_api' | 'telegram_preview' | 'browser_download' | 'cancelled';
  previewFallbackUrl?: string;
  message: string;
}

/**
 * Universally downloads/saves canvas poster according to device capabilities.
 */
export async function downloadCanvasImage(
  canvas: HTMLCanvasElement,
  fileName: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<DownloadResult> {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const fullFileName = fileName.endsWith(`.${format}`) ? fileName : `${fileName}.${format}`;

  // 1. Convert canvas to blob
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, 0.96);
  });

  if (!blob) {
    throw new Error('Canvas blob generation failed');
  }

  const isTg = isTelegramMiniApp();
  const isMobile = isMobileDevice();

  // ==========================================
  // CASE 1: COMPUTER / DESKTOP (PC / Mac / Linux)
  // Show native OS File Menu popup ("Save As" dialog)
  // ==========================================
  if (!isMobile && !isTg) {
    // Try File System Access API (showSaveFilePicker)
    // This pops up the native Windows / Mac OS File Explorer / Finder dialog
    // so the user can choose the exact directory (Desktop, Downloads, Pictures, etc.) and file name!
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fullFileName,
          types: [
            {
              description: format === 'jpeg' ? 'JPEG Image' : 'PNG Image',
              accept: {
                [mimeType]: [`.${format}`],
              },
            },
          ],
        });

        // Write blob data to the chosen file handle
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();

        return {
          success: true,
          method: 'file_picker',
          message: '✓ ফাইলটি আপনার কম্পিউটারে সফলভাবে সেভ করা হয়েছে!',
        };
      } catch (pickerErr: any) {
        // User closed or cancelled the file menu dialog
        if (pickerErr.name === 'AbortError') {
          return {
            success: true,
            method: 'cancelled',
            message: 'সেভ উইন্ডো বাতিল করা হয়েছে।',
          };
        }
        console.warn('showSaveFilePicker failed or not allowed, falling back to standard download:', pickerErr);
      }
    }

    // Desktop Fallback (e.g. Firefox, Safari Desktop, or if user blocked file system access)
    try {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fullFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);

      return {
        success: true,
        method: 'browser_download',
        message: '✓ পোস্টারটি আপনার কম্পিউটার ডাউনলোড ফোল্ডারে সেভ হয়েছে!',
      };
    } catch (desktopErr) {
      console.error('Desktop standard download error:', desktopErr);
    }
  }

  // ==========================================
  // CASE 2: MOBILE DEVICES (Android, iOS, Tablets)
  // Direct save to Google Photos / Gallery / Files
  // ==========================================
  if (isMobile) {
    // 2.A: Try Web Share API with File
    // On Android (Chrome, Edge, Samsung Internet), this triggers the native system share sheet
    // which has options: "Upload to Google Photos" (Google ফটোতে সেভ), "Save to device / Gallery", etc.
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], fullFileName, { type: mimeType });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fullFileName,
            text: 'Cyber Sentinel Poster Studio (গুগল ফটো বা গ্যালারিতে সেভ করুন)',
          });

          return {
            success: true,
            method: 'mobile_share',
            message: '✓ গুগল ফটো বা গ্যালারিতে সফলভাবে পাঠানো ও সেভ করা হয়েছে!',
          };
        }
      } catch (shareErr: any) {
        if (shareErr.name === 'AbortError') {
          return {
            success: true,
            method: 'cancelled',
            message: 'সেভ ডায়লগ বাতিল করা হয়েছে।',
          };
        }
        console.warn('Mobile navigator.share failed, using direct download & preview:', shareErr);
      }
    }

    // 2.B: On Mobile, also trigger automatic direct download so the file goes to Downloads/Photos
    try {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fullFileName;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (e) {
      console.warn('Mobile automatic click download failed:', e);
    }

    // Also prepare fallback preview modal for mobile web / Telegram so user can tap & hold
    // "Save to Photos" if the browser blocks automatic saving.
    const previewDataUrl = canvas.toDataURL(mimeType, 0.96);
    return {
      success: true,
      method: isTg ? 'telegram_preview' : 'mobile_auto_save',
      previewFallbackUrl: previewDataUrl,
      message: '✓ মোবাইলের গ্যালারি বা গুগল ফটোতে সেভ করতে প্রস্তুত!',
    };
  }

  // ==========================================
  // CASE 3: TELEGRAM MINI APP (Bot API 8+)
  // ==========================================
  if (isTg && window.Telegram?.WebApp?.downloadFile) {
    try {
      const dataUrl = canvas.toDataURL(mimeType, 0.96);
      window.Telegram.WebApp.downloadFile({
        url: dataUrl,
        file_name: fullFileName,
      });
      return {
        success: true,
        method: 'telegram_api',
        message: 'টেলিগ্রাম ডাউনলোড শুরু হয়েছে!',
      };
    } catch (tgErr) {
      console.warn('Telegram downloadFile API failed:', tgErr);
    }
  }

  // Final fallback
  const fallbackDataUrl = canvas.toDataURL(mimeType, 0.96);
  return {
    success: true,
    method: 'telegram_preview',
    previewFallbackUrl: fallbackDataUrl,
    message: 'পোস্টারটি প্রস্তুত হয়েছে! ছবিতে চাপ দিয়ে ধরে সেভ করুন।',
  };
}
