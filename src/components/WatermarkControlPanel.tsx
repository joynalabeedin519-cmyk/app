import React, { useRef, useState } from 'react';
import { PosterConfig } from '../types/poster';
import { processLogoBackground } from '../utils/imageProcessing';
import {
  Shield,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Layers,
  CheckCircle2,
  Sparkles,
  Check,
  Star,
} from 'lucide-react';

interface WatermarkControlPanelProps {
  config: PosterConfig;
  onChangeConfig: (newConfig: Partial<PosterConfig>) => void;
}

export const WatermarkControlPanel: React.FC<WatermarkControlPanelProps> = ({
  config,
  onChangeConfig,
}) => {
  const customLogoInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Automatically process background when custom emblem or removal options change
  const handleProcessLogo = (
    imageSrc: string | null,
    optionsOverride?: {
      removeOuterWhite?: boolean;
    }
  ) => {
    if (!imageSrc) {
      onChangeConfig({ processedCustomEmblemSrc: null });
      return;
    }

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const removeOuterWhite =
        optionsOverride?.removeOuterWhite ?? config.emblemRemoveOuterWhite ?? true;
      const removeDarkBg = false; // Always OFF as requested
      const darkThreshold = 30;

      const transparentDataUrl = processLogoBackground(img, {
        removeOuterWhite,
        removeDarkBackground: removeDarkBg,
        darkThreshold,
        clipToCircle: true,
      });

      onChangeConfig({
        processedCustomEmblemSrc: transparentDataUrl,
      });
      setIsProcessing(false);
    };
    img.onerror = () => {
      setIsProcessing(false);
    };
    img.src = imageSrc;
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChangeConfig({
        customEmblemSrc: result,
      });
      handleProcessLogo(result);
    };
    reader.readAsDataURL(file);
  };

  const isRingLogoActive =
    config.customEmblemSrc === '/csb-logo.jpg' ||
    (Boolean(config.customEmblemSrc) && config.customEmblemSrc!.includes('photo-2026-08-03'));

  return (
    <div className="bg-slate-900/85 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold text-white">
            লোগো ওয়াটারমার্ক ও ব্যাকগ্রাউন্ড নিয়ন্ত্রণ
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeConfig({ showEmblem: !config.showEmblem })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border active:scale-95 ${
              config.showEmblem
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}
          >
            {config.showEmblem ? (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" /> <span>দৃশ্যমান (ON)</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" /> <span>লুকায়িত (OFF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {config.showEmblem && (
        <div className="space-y-4 sm:space-y-5">
          {/* =========================================================================
              FEATURED PROMINENT CARD: "রিং লোগো সেট করুন" (ENLARGED & HIGH VISIBILITY)
              ========================================================================= */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md ${
              isRingLogoActive
                ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/40 border-emerald-500/60 shadow-emerald-950/20 ring-1 ring-emerald-500/40'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Large Ring Logo Thumbnail with Glowing Border */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-cyan-400/90 shadow-lg shadow-cyan-500/30 bg-black flex items-center justify-center ring-4 ring-blue-600/30">
                  <img
                    src="/csb-logo.jpg"
                    alt="Official CSB Ring Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://i.ibb.co/qLTS9rRR/photo-2026-08-03-16-16-34.jpg';
                    }}
                  />
                </div>
                {isRingLogoActive && (
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-black shadow-md border border-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Information & Description */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>অফিশিয়াল সাইবার সেন্টিনেল রিং লোগো</span>
                  </h4>
                  {isRingLogoActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm mx-auto sm:mx-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      পোস্টারে অলরেডি সেট করা আছে (Active)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30 mx-auto sm:mx-0">
                      ১-ক্লিকে সেট করার জন্য তৈরি
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  হেডারের মূল বৃত্তাকার ব্লু-রিং হুডেড হ্যাকার লোগোটি সরাসরি পোস্টারের মাঝখানে ওয়াটারমার্ক হিসেবে বসাতে নিচের বাটনে চাপ দিন।
                </p>

                {/* Big Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeConfig({ customEmblemSrc: '/csb-logo.jpg' });
                      handleProcessLogo('/csb-logo.jpg');
                    }}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-98 ${
                      isRingLogoActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 border border-emerald-400/50'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40 border border-blue-400/40'
                    }`}
                  >
                    {isRingLogoActive ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>✓ রিং লোগো সফলভাবে সেট করা আছে (রি-ফ্রেশ করুন)</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4 fill-cyan-300 text-cyan-300" />
                        <span>★ রিং লোগো সেট করুন (১-ক্লিকে পোস্টারে বসান)</span>
                      </>
                    )}
                  </button>

                  {isRingLogoActive && (
                    <button
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          customEmblemSrc: null,
                          processedCustomEmblemSrc: null,
                        })
                      }
                      className="text-xs text-slate-400 hover:text-rose-400 underline decoration-slate-600 cursor-pointer py-1 transition"
                    >
                      ডিফল্ট ভেক্টরে ফিরে যান
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Custom Logo Section */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>অন্যান্য কাস্টম লোগো ফাইল আপলোড</span>
                  {config.customEmblemSrc && !isRingLogoActive && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-normal">
                      <CheckCircle2 className="w-3 h-3" /> কাস্টম ফাইল সক্রিয়
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-400">
                  আপনার নিজস্ব কোনো নতুন লোগো ফাইল থাকলে এখানে আপলোড করতে পারেন।
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  ref={customLogoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomLogoUpload}
                />
                <button
                  type="button"
                  onClick={() => customLogoInputRef.current?.click()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition text-xs font-bold cursor-pointer active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>ফাইল আপলোড করুন</span>
                </button>

                {config.customEmblemSrc && !isRingLogoActive && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeConfig({
                        customEmblemSrc: null,
                        processedCustomEmblemSrc: null,
                      })
                    }
                    className="p-2 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800 transition cursor-pointer"
                    title="রিমুভ করুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Circular Crop option if custom emblem uploaded */}
            {config.customEmblemSrc && (
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.emblemRemoveOuterWhite}
                    onChange={(e) => {
                      const val = e.target.checked;
                      onChangeConfig({ emblemRemoveOuterWhite: val });
                      handleProcessLogo(config.customEmblemSrc, {
                        removeOuterWhite: val,
                      });
                    }}
                    className="accent-blue-500 rounded"
                  />
                  <span className="text-slate-300">বাইরের সাদা কর্নার কাটা (Circular Crop)</span>
                </label>
                {isProcessing && (
                  <span className="text-cyan-300 font-mono text-[11px] animate-pulse">
                    প্রসেসিং হচ্ছে...
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Watermark Blend Mode & Opacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>ওয়াটারমার্ক ব্লেন্ড মোড (Blend Mode)</span>
              </label>
              <select
                value={config.emblemBlendMode || 'normal'}
                onChange={(e) =>
                  onChangeConfig({
                    emblemBlendMode: e.target.value as 'normal' | 'screen' | 'lighten',
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="normal">Normal (স্বাভাবিক স্পষ্টতা)</option>
                <option value="screen">Screen (হোলোগ্রাফিক নিয়ন গ্লো)</option>
                <option value="lighten">Lighten (লাইট ব্লেন্ড)</option>
              </select>
            </div>

            {/* Opacity */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>ওয়াটারমার্ক স্বচ্ছতা (Opacity)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {Math.round((config.emblemOpacity ?? 0.88) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.02"
                value={config.emblemOpacity ?? 0.88}
                onChange={(e) =>
                  onChangeConfig({ emblemOpacity: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Scale & Y-Offset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>লোগো সাইজ স্কেল (Scale)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {Math.round((config.emblemScale || 1.05) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={config.emblemScale || 1.05}
                onChange={(e) =>
                  onChangeConfig({ emblemScale: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>উপরে / নিচে পজিশন (Y Offset)</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {config.emblemOffsetY || 0}px
                </span>
              </div>
              <input
                type="range"
                min="-120"
                max="120"
                step="5"
                value={config.emblemOffsetY || 0}
                onChange={(e) =>
                  onChangeConfig({ emblemOffsetY: parseInt(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
