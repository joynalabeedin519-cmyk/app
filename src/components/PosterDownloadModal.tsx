import React, { useState } from 'react';
import {
  Download,
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { triggerDirectDownload, sharePosterImage } from '../utils/downloadAndCopy';

interface PosterDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageBlob?: Blob | null;
  fileName: string;
  resolution?: number;
  onCopyClipboard?: () => void;
}

export const PosterDownloadModal: React.FC<PosterDownloadModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageBlob,
  fileName,
  resolution = 1080,
  onCopyClipboard,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [downloadDone, setDownloadDone] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const showInternalToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Copy Image directly to Clipboard
  const handleCopy = async () => {
    try {
      if (imageBlob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': imageBlob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        showInternalToast('✓ ছবি সফলভাবে কপি হয়েছে! টেলিগ্রাম বা ফেসবুক চ্যাটে পেস্ট করুন।');
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }

    // Secondary attempt: call parent handler if provided
    if (onCopyClipboard) {
      onCopyClipboard();
      setCopied(true);
      showInternalToast('✓ ছবি কপি হয়েছে!');
      setTimeout(() => setCopied(false), 2500);
      return;
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      showInternalToast('✓ ছবির লিঙ্ক কপি হয়েছে!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showInternalToast('কপি করতে নিচের ছবির উপর চাপ দিয়ে ধরে "Copy Image" দিন।');
    }
  };

  // Direct Download Trigger
  const handleDownload = () => {
    const success = triggerDirectDownload(imageUrl, fileName);
    if (success) {
      setDownloadDone(true);
      showInternalToast('✓ ডাউনলোড শুরু হয়েছে!');
      setTimeout(() => setDownloadDone(false), 3000);
    }
  };

  // Mobile Web Share / Google Photos
  const handleShare = async () => {
    if (imageBlob) {
      const shared = await sharePosterImage(imageBlob, fileName, 'Cyber Sentinel Bangladesh');
      if (shared) {
        showInternalToast('✓ গুগল ফটো / শেয়ার সফল হয়েছে!');
        return;
      }
    }
    // Fallback: trigger download
    handleDownload();
  };

  // Open Full Image in new tab / window
  const handleOpenNewWindow = () => {
    try {
      const newWin = window.open();
      if (newWin) {
        newWin.document.write(
          `<html><head><title>${fileName}</title></head><body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="${imageUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" alt="Poster" /></body></html>`
        );
        newWin.document.close();
      } else {
        triggerDirectDownload(imageUrl, fileName);
      }
    } catch {
      triggerDirectDownload(imageUrl, fileName);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast inside modal */}
        {copyToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{copyToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>পোস্টার রেডি!</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {resolution}×{resolution}px
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                ডাউনলোড করুন অথবা সরাসরি কপি করে যেকোনো জায়গায় পেস্ট করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner: Fool-proof for mobile, Telegram & PC */}
        <div className="my-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-slate-200 text-xs space-y-1.5 shrink-0">
          <div className="flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-emerald-300">মোবাইল বা টেলিগ্রামে:</strong> ছবির উপর{' '}
              <strong className="text-white underline underline-offset-2">১ সেকেন্ড চেপে ধরে রাখুন (Tap & Hold)</strong>{' '}
              তারপর <strong className="text-white">"Download image"</strong> বা{' '}
              <strong className="text-white">"Save to Photos"</strong> দিন।
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
            <Laptop className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-blue-300">কম্পিউটারে:</strong> নিচের{' '}
              <strong className="text-white">"ডাউনলোড করুন"</strong> বাটনে ক্লিক করুন অথবা রাইট ক্লিক করে{' '}
              <strong className="text-white">"Save image as..."</strong> দিন।
            </div>
          </div>
        </div>

        {/* Poster Image Preview (Touch friendly) */}
        <div className="relative flex-1 min-h-[190px] max-h-[350px] bg-black rounded-xl border border-slate-800 overflow-auto flex items-center justify-center p-2 group">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg select-auto cursor-pointer"
            title="ছবির উপর চেপে ধরে সেভ বা কপি করুন"
          />
        </div>

        {/* Action Buttons: Prominent COPY, DOWNLOAD, and SHARE */}
        <div className="pt-3.5 border-t border-slate-800/80 mt-3 flex flex-col gap-2 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'ছবি কপি হয়েছে!' : '📋 ছবি কপি করুন (Copy)'}</span>
            </button>

            {/* Direct Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer active:scale-95 shadow-md ${
                downloadDone
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'
              }`}
            >
              {downloadDone ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloadDone ? 'ডাউনলোড সম্পন্ন!' : '📥 ডাউনলোড করুন (Download)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Web Share / Google Photos */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>শেয়ার / গুগল ফটোতে সেভ</span>
              </button>
            )}

            {/* Open Full in New Tab */}
            <button
              type="button"
              onClick={handleOpenNewWindow}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
              title="নতুন ট্যাবে পুরো ছবি খুলুন"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>নতুন উইন্ডোয় খুলুন</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
            >
              বন্ধ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
