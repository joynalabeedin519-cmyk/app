import React, { useState } from 'react';
import { Bookmark, X, Check, Sparkles } from 'lucide-react';

interface SavePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (projectName: string) => void;
  defaultName?: string;
}

export const SavePosterModal: React.FC<SavePosterModalProps> = ({
  isOpen,
  onClose,
  onConfirmSave,
  defaultName = '',
}) => {
  const [name, setName] = useState<string>(defaultName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'আমার পোস্টার ড্রাফট';
    onConfirmSave(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl shadow-black/80 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              পোস্টার ডিজাইন সংরক্ষণ করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              সংরক্ষিত ডিজাইনের নাম দিন:
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: হ্যারাসমেন্ট রিমুভ নোটিশ - ০১"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none transition font-sans"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>এই নাম দিয়ে আপনার অ্যাপের সংরক্ষিত তালিকায় যুক্ত হবে।</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60 border border-emerald-400/30 cursor-pointer active:scale-95 transition"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>সংরক্ষণ নিশ্চিত করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
