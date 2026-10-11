import React, { useState } from 'react';
import { Download, X, Share2, Copy, Check, ExternalLink, HelpCircle, HardDrive, Smartphone, Sparkles } from 'lucide-react';
import { isMobileDevice, isTelegramMiniApp } from '../utils/telegramDownload';

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
  const isMobile = isMobileDevice();
  const isTg = isTelegramMiniApp();

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

  // Mobile Web Share / Google Photos / Gallery save
  const handleShareOrPhotosSave = async () => {
    try {
      if (navigator.share) {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: blob.type || 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: fileName,
            text: 'Cyber Sentinel Poster - গুগল ফটো বা গ্যালারিতে সেভ করুন',
          });
          return;
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.warn('Share failed:', err);
    }

    // Direct download fallback
    handleDirectDownload();
  };

  // PC / Desktop Save with File Picker or Direct download
  const handleDesktopFilePickerDownload = async () => {
    try {
      if (typeof window.showSaveFilePicker === 'function') {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'PNG Image',
              accept: { 'image/png': ['.png'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        onClose();
        return;
      }
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.warn('File picker aborted or unsupported:', e);
    }

    handleDirectDownload();
  };

  const handleDirectDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener';
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
              <p className="text-xs text-slate-400">
                {isMobile ? 'মোবাইল ও গুগল ফটো / গ্যালারিতে সেভ করুন' : 'কম্পিউটার নির্দিষ্ট ফোল্ডারে সেভ করুন'}
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

        {/* Dynamic Helpful Instruction Box based on device */}
        {isMobile ? (
          <div className="my-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5 shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-emerald-300">মোবাইল ইউজারদের জন্য:</span> নিচের{' '}
              <strong className="text-white">"গুগল ফটো / গ্যালারিতে সেভ করুন"</strong> বাটনে চাপ দিন, অথবা ছবির উপর{' '}
              <strong className="text-white underline underline-offset-2">চাপ দিয়ে ধরে রাখুন (Tap & Hold)</strong>{' '}
              করে সরাসরি <strong className="text-white">"Save Image"</strong> সিলেক্ট করুন।
            </div>
          </div>
        ) : (
          <div className="my-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5 shrink-0">
            <HardDrive className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-blue-300">কম্পিউটার ইউজারদের জন্য:</span>{' '}
              <strong className="text-white">"ফোল্ডার সিলেক্ট করে সেভ করুন"</strong> এ ক্লিক করলে আপনার পিসির ফাইল মেনু ওপেন হবে, যেখান থেকে পছন্দের ড্রাইভ/ফোল্ডারে সেভ করতে পারবেন।
            </div>
          </div>
        )}

        {/* Poster Image Preview */}
        <div className="relative flex-1 min-h-[180px] max-h-[360px] bg-slate-950/80 rounded-xl border border-slate-800 overflow-auto flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt={fileName}
            className="max-h-full max-w-full object-contain rounded-lg shadow-lg select-none"
          />
        </div>

        {/* Bottom Actions tailored to Device */}
        <div className="pt-3 border-t border-slate-800/80 mt-3 flex flex-col sm:flex-row gap-2 shrink-0">
          {isMobile ? (
            <>
              {/* Mobile: Direct Share & Save to Google Photos */}
              <button
                type="button"
                onClick={handleShareOrPhotosSave}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>গুগল ফটো / গ্যালারিতে সেভ করুন</span>
              </button>

              <button
                type="button"
                onClick={handleDirectDownload}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
                title="সরাসরি ডাউনলোড"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>ডাউনলোড</span>
              </button>
            </>
          ) : (
            <>
              {/* PC / Laptop: File Picker Save As menu dialog */}
              <button
                type="button"
                onClick={handleDesktopFilePickerDownload}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 transition cursor-pointer active:scale-95"
              >
                <HardDrive className="w-4 h-4 text-cyan-300" />
                <span>ফোল্ডার সিলেক্ট করে সেভ করুন (Save As)</span>
              </button>

              <button
                type="button"
                onClick={handleDirectDownload}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer active:scale-95"
                title="সরাসরি ডাউনলোড ফোল্ডারে সেভ করুন"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>সরাসরি ডাউনলোড</span>
              </button>
            </>
          )}

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
