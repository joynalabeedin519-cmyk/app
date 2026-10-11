import React, { useState } from 'react';
import { Download, X, Share2, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';

interface TelegramDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  fileName: string;
  resolution?: number;
}

export const TelegramDownloadModal: React.FC<TelegramDownloadModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fileName,
  resolution = 1080,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        // Convert dataUrl to blob for sharing if supported
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: blob.type || 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fileName,
            text: 'Cyber Sentinel Poster',
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }

    // Fallback: trigger standard open
    window.open(imageUrl, '_blank');
  };

  const handleDirectDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>পোস্টার রেডি!</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {resolution}px
                </span>
              </h3>
              <p className="text-xs text-slate-400">টেলিগ্রাম ও মোবাইলে সহজে সেভ করার উপায়</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Instruction Alert */}
        <div className="my-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 shrink-0">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-300">টেলিগ্রাম সেভ নিয়ম:</span> নিচের ছবির উপর{' '}
            <strong className="text-white underline underline-offset-2">চাপ দিয়ে ধরে রাখুন (Tap & Hold)</strong>{' '}
            এবং <strong className="text-white">"Save Image"</strong> বা <strong className="text-white">"Download"</strong> এ টিপ দিন।
          </div>
        </div>

        {/* Poster Image Preview */}
        <div className="relative flex-1 min-h-[180px] max-h-[380px] bg-slate-950/80 rounded-xl border border-slate-800 overflow-auto flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg select-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-800/80 mt-3 flex flex-col sm:flex-row gap-2 shrink-0">
          {/* Share / Open Sheet */}
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>গ্যালারিতে সেভ / শেয়ার করুন</span>
          </button>

          {/* Browser Download */}
          <button
            type="button"
            onClick={handleDirectDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
            title="সরাসরি ডাউনলোড করার চেষ্টা করুন"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>সরাসরি ডাউনলোড</span>
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          >
            বন্ধ
          </button>
        </div>
      </div>
    </div>
  );
};
