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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0e0422] border-2 border-purple-600/60 rounded-2xl p-5 shadow-2xl shadow-purple-950 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              পোস্টার ডিজাইন সংরক্ষণ করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              সংরক্ষিত ডিজাইনের নাম দিন:
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: হ্যারাসমেন্ট রিমুভ নোটিশ - ০১"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#060114] border border-purple-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-purple-400/40 outline-none transition font-sans"
            />
            <p className="text-[11px] text-purple-300/70 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>এই নাম দিয়ে আপনার অ্যাপের সংরক্ষিত তালিকায় যুক্ত হবে।</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-900/40 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950 border border-emerald-400/40 cursor-pointer"
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
