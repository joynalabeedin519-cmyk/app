import React, { useRef } from 'react';
import { PosterConfig } from '../types/poster';
import { generateSampleLeftProfileSvg, generateSampleRightTakedownSvg } from '../utils/sampleImages';
import {
  Upload,
  Image as ImageIcon,
  ZoomIn,
  Move,
  RotateCcw,
  Sparkles,
  Layers,
  Trash2,
  CircleDot,
  SlidersHorizontal,
} from 'lucide-react';

interface ImageUploadPanelProps {
  config: PosterConfig;
  onChangeConfig: (newConfig: Partial<PosterConfig>) => void;
}

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  config,
  onChangeConfig,
}) => {
  const leftFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'left' | 'right'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (side === 'left') {
        onChangeConfig({
          leftImageSrc: result,
          leftImageScale: 1,
          leftImageOffsetX: 0,
          leftImageOffsetY: 0,
        });
      } else {
        onChangeConfig({
          rightImageSrc: result,
          rightImageScale: 1,
          rightImageOffsetX: 0,
          rightImageOffsetY: 0,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Grid of Two Columns for Left and Right Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* =========================================
            LEFT IMAGE (Image 1: Target Profile)
            ========================================= */}
        <div className="bg-slate-900/85 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                বাম পাশের ছবি (টার্গেট প্রোফাইল)
              </h3>
            </div>
            {config.leftImageSrc && (
              <button
                type="button"
                onClick={() => onChangeConfig({ leftImageSrc: null })}
                className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer p-1"
                title="রিমুভ করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => leftFileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/70 hover:bg-slate-900/60 group"
          >
            <input
              ref={leftFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'left')}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 group-hover:bg-blue-600/30 text-blue-400 group-hover:text-cyan-300 flex items-center justify-center transition border border-slate-700/60">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  টার্গেট প্রোফাইলের স্ক্রিনশট আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WebP ফাইল সাপোর্টেড</p>
              </div>
            </div>
          </div>

          {/* Quick preset button */}
          <button
            type="button"
            onClick={() =>
              onChangeConfig({
                leftImageSrc: generateSampleLeftProfileSvg(),
                leftImageScale: 1,
                leftImageOffsetX: 0,
                leftImageOffsetY: 0,
              })
            }
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-xs text-cyan-300 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer font-semibold active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>ডিফল্ট ফেসবুক স্যাম্পল প্রোফাইল লোড</span>
          </button>

          {/* Position & Zoom Controls */}
          {config.leftImageSrc && (
            <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-400" /> জুম (Zoom)
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {Math.round((config.leftImageScale || 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={config.leftImageScale || 1}
                  onChange={(e) =>
                    onChangeConfig({ leftImageScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>X পজিশন</span>
                    <span className="font-mono text-cyan-300">
                      {Math.round(config.leftImageOffsetX || 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    step="5"
                    value={config.leftImageOffsetX || 0}
                    onChange={(e) =>
                      onChangeConfig({ leftImageOffsetX: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>Y পজিশন</span>
                    <span className="font-mono text-cyan-300">
                      {Math.round(config.leftImageOffsetY || 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    step="5"
                    value={config.leftImageOffsetY || 0}
                    onChange={(e) =>
                      onChangeConfig({ leftImageOffsetY: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    leftImageScale: 1,
                    leftImageOffsetX: 0,
                    leftImageOffsetY: 0,
                  })
                }
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white cursor-pointer pt-1 transition"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>পজিশন রিসেট করুন</span>
              </button>
            </div>
          )}
        </div>

        {/* =========================================
            RIGHT IMAGE (Image 2: Block / Confirmation)
            ========================================= */}
        <div className="bg-slate-900/85 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                ডান পাশের ছবি (ব্লক / কনফার্মেশন)
              </h3>
            </div>
            {config.rightImageSrc && (
              <button
                type="button"
                onClick={() => onChangeConfig({ rightImageSrc: null })}
                className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer p-1"
                title="রিমুভ করুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => rightFileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer transition bg-slate-950/70 hover:bg-slate-900/60 group"
          >
            <input
              ref={rightFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'right')}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 group-hover:bg-indigo-600/30 text-indigo-400 group-hover:text-indigo-200 flex items-center justify-center transition border border-slate-700/60">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  ব্লক/রিমুভ কনফার্মেশন স্ক্রিনশট আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-400">"This content isn't available" ইত্যাদি</p>
              </div>
            </div>
          </div>

          {/* Quick preset button */}
          <button
            type="button"
            onClick={() =>
              onChangeConfig({
                rightImageSrc: generateSampleRightTakedownSvg(),
                rightImageScale: 1,
                rightImageOffsetX: 0,
                rightImageOffsetY: 0,
              })
            }
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-xs text-cyan-300 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer font-semibold active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ডিফল্ট "Content not available" স্যাম্পল লোড</span>
          </button>

          {/* Position & Zoom Controls */}
          {config.rightImageSrc && (
            <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-400" /> জুম (Zoom)
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {Math.round((config.rightImageScale || 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={config.rightImageScale || 1}
                  onChange={(e) =>
                    onChangeConfig({ rightImageScale: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>X পজিশন</span>
                    <span className="font-mono text-cyan-300">
                      {Math.round(config.rightImageOffsetX || 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    step="5"
                    value={config.rightImageOffsetX || 0}
                    onChange={(e) =>
                      onChangeConfig({ rightImageOffsetX: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
                    <span>Y পজিশন</span>
                    <span className="font-mono text-cyan-300">
                      {Math.round(config.rightImageOffsetY || 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-250"
                    max="250"
                    step="5"
                    value={config.rightImageOffsetY || 0}
                    onChange={(e) =>
                      onChangeConfig({ rightImageOffsetY: parseInt(e.target.value) })
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    rightImageScale: 1,
                    rightImageOffsetX: 0,
                    rightImageOffsetY: 0,
                  })
                }
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white cursor-pointer pt-1 transition"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>পজিশন রিসেট করুন</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Corner Rounding & Soft Circle Style */}
      <div className="bg-slate-900/85 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              ছবির চারদিকের কর্নার রাউন্ড ও সফট সার্কেল স্টাইল
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            {config.imageCornerRadius || 0}px
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>কর্নার রাউন্ড মাত্রা (Corner Radius)</span>
              <span className="font-mono text-cyan-300 font-bold">
                {config.imageCornerRadius || 0}px
                {(config.imageCornerRadius || 0) >= 50
                  ? ' (সার্কুলার/পিল)'
                  : (config.imageCornerRadius || 0) > 0
                  ? ' (সফট রাউন্ড)'
                  : ' (শার্প চারকোনা)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="2"
              value={config.imageCornerRadius || 0}
              onChange={(e) =>
                onChangeConfig({ imageCornerRadius: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Quick Rounding Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            {[
              { label: 'শার্প চারকোনা (০px)', value: 0 },
              { label: 'সফট কার্ভ (১৬px)', value: 16 },
              { label: 'মডারেট রাউন্ড (৩২px)', value: 32 },
              { label: 'সার্কেল / ওভাল (৫৬px)', value: 56 },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onChangeConfig({ imageCornerRadius: p.value })}
                className={`py-2 px-2.5 rounded-xl border font-semibold transition cursor-pointer text-[11px] active:scale-95 ${
                  (config.imageCornerRadius || 0) === p.value
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-900/50'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            💡 ছবি দুটির চারদিকের কর্নারকে নরম, গোল বা সার্কুলার রূপ দিতে স্লাইডার ব্যবহার করুন।
          </p>
        </div>
      </div>

      {/* Frame Styling Settings */}
      <div className="bg-slate-900/85 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-lg shadow-black/20 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              ফ্রেম ও লাল বর্ডার স্টাইল (Outer Frame & Divider)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>লাল বর্ডার এর প্রস্থ</span>
              <span className="font-mono text-cyan-300 font-bold">{config.outerBorderWidth}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={config.outerBorderWidth}
              onChange={(e) =>
                onChangeConfig({ outerBorderWidth: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>মাঝের লাল ডিভাইডার লাইন</span>
              <span className="font-mono text-cyan-300 font-bold">{config.dividerWidth}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="16"
              step="1"
              value={config.dividerWidth}
              onChange={(e) =>
                onChangeConfig({ dividerWidth: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>ফ্রেমের রাউন্ড কর্নার</span>
              <span className="font-mono text-cyan-300 font-bold">{config.frameCornerRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="2"
              value={config.frameCornerRadius}
              onChange={(e) =>
                onChangeConfig({ frameCornerRadius: parseInt(e.target.value) })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
