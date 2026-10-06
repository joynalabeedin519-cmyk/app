import React, { useRef, useState } from 'react';
import { PosterConfig, PresetTemplate } from '../types/poster';
import { NOTICE_PRESETS } from '../utils/presets';
import {
  Type,
  Sparkles,
  Sliders,
  Palette,
  Pipette,
  Undo2,
  Maximize2,
} from 'lucide-react';

interface TextControlPanelProps {
  config: PosterConfig;
  onChangeConfig: (newConfig: Partial<PosterConfig>) => void;
  onApplyPreset: (preset: PresetTemplate) => void;
}

const PALETTE_COLORS = [
  { name: 'লাল (Red)', hex: '#dc2626' },
  { name: 'কালো (Black)', hex: '#000000' },
  { name: 'নীল (Blue)', hex: '#2563eb' },
  { name: 'সবুজ (Green)', hex: '#16a34a' },
  { name: 'হলুদ (Yellow)', hex: '#eab308' },
  { name: 'কমলা (Orange)', hex: '#ea580c' },
  { name: 'পার্পল (Purple)', hex: '#9333ea' },
  { name: 'সায়ান (Cyan)', hex: '#06b6d4' },
  { name: 'গোলাপি (Pink)', hex: '#ec4899' },
  { name: 'সাদা (White)', hex: '#ffffff' },
];

export const TextControlPanel: React.FC<TextControlPanelProps> = ({
  config,
  onChangeConfig,
  onApplyPreset,
}) => {
  const [customColor, setCustomColor] = useState<string>('#dc2626');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply color to currently highlighted text selection in textarea
  const handleApplyColorToSelection = (colorHex: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const val = config.freeformText || '';
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    if (start === end) {
      const cleaned = val.replace(/\[color:[^\]]+\]/g, '').replace(/\[\/color\]/g, '');
      onChangeConfig({ freeformText: `[color:${colorHex}]${cleaned}[/color]` });
      return;
    }

    const before = val.substring(0, start);
    const selected = val.substring(start, end);
    const after = val.substring(end);

    const cleanedSelected = selected
      .replace(/\[color:[^\]]+\]/g, '')
      .replace(/\[\/color\]/g, '');
    const replacement = `[color:${colorHex}]${cleanedSelected}[/color]`;

    onChangeConfig({ freeformText: before + replacement + after });
  };

  // Strip color formatting from selection
  const handleClearColorFromSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const val = config.freeformText || '';
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;

    if (start === end) {
      const cleaned = val.replace(/\[color:[^\]]+\]/g, '').replace(/\[\/color\]/g, '');
      onChangeConfig({ freeformText: cleaned });
      return;
    }

    const before = val.substring(0, start);
    const selected = val.substring(start, end);
    const after = val.substring(end);
    const cleanedSelected = selected
      .replace(/\[color:[^\]]+\]/g, '')
      .replace(/\[\/color\]/g, '');

    onChangeConfig({ freeformText: before + cleanedSelected + after });
  };

  return (
    <div className="space-y-5">
      {/* 1. Notice Presets with TEAM CSB in Red */}
      <div className="bg-[#0d0421] rounded-2xl p-3.5 sm:p-5 border border-purple-900/60 shadow-lg shadow-purple-950/40 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>প্রিসেট নোটিশ টেমপ্লেট (TEAM CSB সহ)</span>
          </label>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-600/50 font-mono font-bold">
            {NOTICE_PRESETS.length}টি প্রিসেট
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
          {NOTICE_PRESETS.map((preset) => {
            const isSelected = config.freeformText === preset.freeformText;

            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className={`text-left p-3 rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#1e0a40] border-blue-500 text-white shadow-md shadow-blue-950/80 ring-1 ring-blue-500/60'
                    : 'bg-[#060114] border-purple-900/50 text-purple-200 hover:border-purple-600 hover:bg-[#140630]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-100">{preset.nameBn}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 font-bold border border-red-800/60 shrink-0">
                    TEAM CSB
                  </span>
                </div>
                <div className="line-clamp-2 text-[11px] text-purple-300/80 font-sans leading-relaxed">
                  {preset.freeformText.replace(/\[color:[^\]]+\]/g, '').replace(/\[\/color\]/g, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Text Selection Colorizer Toolbar */}
      <div className="bg-gradient-to-r from-[#12052e] via-[#0d0421] to-[#080216] rounded-2xl p-3.5 sm:p-5 border border-purple-800/60 shadow-lg space-y-3 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              সিলেক্ট করে টেক্সট কালার করার টুলবার
            </h3>
          </div>
          <span className="text-[11px] text-cyan-300 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-500/40">
            যেকোনো শব্দ সিলেক্ট করে কালার বাটন চাপুন
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#060112] border border-purple-900/60 flex flex-wrap items-center justify-between gap-3">
          {/* Swatches */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-semibold text-purple-200 mr-1 flex items-center gap-1">
              <Pipette className="w-3.5 h-3.5 text-blue-400" />
              প্যালেট:
            </span>

            {PALETTE_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleApplyColorToSelection(c.hex)}
                title={`সিলেক্টেড টেক্সটে ${c.name} কালার দিন`}
                className="w-7 h-7 rounded-lg border border-purple-900 hover:scale-110 active:scale-95 transition cursor-pointer shadow-sm flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
              />
            ))}

            {/* Custom Color input */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-purple-900/70">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-7 h-7 rounded-lg border border-purple-800 bg-transparent cursor-pointer"
                title="কাস্টম কালার বেছে নিন"
              />
              <button
                type="button"
                onClick={() => handleApplyColorToSelection(customColor)}
                className="px-2.5 py-1 rounded-md bg-[#19083b] hover:bg-[#250d54] text-blue-200 text-xs font-semibold cursor-pointer border border-blue-700/50"
              >
                প্রয়োগ
              </button>
            </div>
          </div>

          {/* Clear Color Formatting button */}
          <button
            type="button"
            onClick={handleClearColorFromSelection}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14062f] hover:bg-[#1d0944] text-purple-200 hover:text-white text-xs border border-purple-800/60 transition cursor-pointer"
            title="সিলেক্টেড অংশের কালার রিমুভ করে স্বাভাবিক করুন"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>কালার মুছুন</span>
          </button>
        </div>

        <p className="text-[11px] text-purple-300/70">
          💡 নিচের টেক্সটবক্সে মাউস দিয়ে কোনো লেখা হাইলাইট (সিলেক্ট) করুন, তারপর ওপরের কালার বাটনে চাপ দিন।
        </p>
      </div>

      {/* 3. Permanent Freeform Banner Text Editor */}
      <div className="bg-[#0d0421] rounded-2xl p-3.5 sm:p-5 border border-purple-900/60 shadow-lg space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">ব্যানার টেক্সট এডিটর</h3>
          </div>
          <span className="text-xs text-blue-300 font-mono font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-600/40">
            ফ্রিফর্ম মোড সক্রিয়
          </span>
        </div>

        {/* Textarea */}
        <div className="space-y-4">
          <textarea
            ref={textareaRef}
            rows={5}
            value={config.freeformText}
            onChange={(e) => onChangeConfig({ freeformText: e.target.value })}
            placeholder="প্রতিনিয়ত হ্যারাসমেন্ট করার অপরাধে&#10;একটি আইডি রিমুভ করা হলো [color:#dc2626]TEAM CSB[/color]&#10;পক্ষ থেকে।"
            className="w-full px-4 py-3 rounded-xl bg-[#060112] border border-purple-900/70 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-purple-400/40 outline-none transition font-sans leading-relaxed"
          />

          {/* New Font Styles Option (ফন্ট স্টাইল নির্বাচন) */}
          <div className="p-4 rounded-xl bg-[#070116] border border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  ফন্ট স্টাইল নির্বাচন (Font Styles)
                </span>
              </div>
              <span className="text-[10px] text-blue-300 font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-600/40 font-semibold">
                {config.bannerFontFamily || 'Hind Siliguri'}
              </span>
            </div>

            {/* Font Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
              {[
                {
                  id: 'Hind Siliguri',
                  name: 'হিন্দ শিলিগুড়ি (Hind Siliguri)',
                  badge: 'ডিফল্ট বোল্ড',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Hind Siliguri', sans-serif",
                },
                {
                  id: 'Anek Bangla',
                  name: 'অনেক্ বাংলা (Anek Bangla)',
                  badge: 'স্ট্রং ও কমপ্যাক্ট',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Anek Bangla', sans-serif",
                },
                {
                  id: 'Noto Sans Bengali',
                  name: 'নোটো সান্স (Noto Sans)',
                  badge: 'মডার্ন ও পরিষ্কার',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Noto Sans Bengali', sans-serif",
                },
                {
                  id: 'Tiro Bangla',
                  name: 'তিরো বাংলা (Tiro Bangla)',
                  badge: 'ফর্মাল ও ঐতিহ্যবাহী',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Tiro Bangla', serif",
                },
                {
                  id: 'Galada',
                  name: 'গালাদা (Galada)',
                  badge: 'স্টাইলিশ কার্ভি',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Galada', cursive",
                },
                {
                  id: 'Mina',
                  name: 'মিনা (Mina)',
                  badge: 'স্লিম ও জ্যামিতিক',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Mina', sans-serif",
                },
                {
                  id: 'Atma',
                  name: 'আত্না (Atma)',
                  badge: 'বোল্ড ও পাঞ্চি',
                  sample: 'হ্যারাসমেন্ট রিমুভ',
                  fontFamily: "'Atma', sans-serif",
                },
              ].map((f) => {
                const isSelected = (config.bannerFontFamily || 'Hind Siliguri') === f.id;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChangeConfig({ bannerFontFamily: f.id })}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-[#1e0a40] border-blue-500 text-white shadow-md shadow-blue-950/80 ring-1 ring-blue-500/60'
                        : 'bg-[#0a031c] border-purple-900/50 text-purple-200 hover:border-purple-600 hover:bg-[#140630]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-200">{f.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-mono border border-purple-800 shrink-0">
                        {f.badge}
                      </span>
                    </div>
                    <div
                      className="text-sm font-bold text-cyan-300 pt-0.5 tracking-wide"
                      style={{ fontFamily: f.fontFamily }}
                    >
                      {f.sample} TEAM CSB
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Font Weight Selector */}
            <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-xs">
              <span className="text-purple-300/80 font-medium">ফন্টের পুরুত্ব (Font Weight):</span>
              <div className="flex items-center gap-1 bg-[#05010e] p-0.5 rounded-lg border border-purple-900/60">
                {[
                  { label: 'বোল্ড (700)', value: '700' },
                  { label: 'এক্সট্রা বোল্ড (800)', value: '800' },
                  { label: 'ব্ল্যাক (900)', value: '900' },
                ].map((w) => (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => onChangeConfig({ bannerFontWeight: w.value })}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      (config.bannerFontWeight || '800') === w.value
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Separate Banner Size vs Text Size Controls */}
        <div className="pt-4 border-t border-purple-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>ব্যানারের সাইজ ও লেখার সাইজ পৃথক নিয়ন্ত্রণ</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#060114] border border-purple-900/60">
            {/* Control 1: Banner Height / Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>১. ব্যানারের সাইজ / উচ্চতা (Banner Size)</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {Math.round((config.bannerHeightScale || 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.6"
                step="0.05"
                value={config.bannerHeightScale || 1}
                onChange={(e) =>
                  onChangeConfig({ bannerHeightScale: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-purple-400/60">
                ব্যানারটির উচ্চতা বড় বা ছোট করে স্পেস নিয়ন্ত্রণ করুন।
              </p>
            </div>

            {/* Control 2: Text Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>২. লেখার ফন্ট সাইজ (Text Font Size)</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {Math.round((config.bannerFontSize || 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.65"
                max="1.45"
                step="0.05"
                value={config.bannerFontSize || 1}
                onChange={(e) =>
                  onChangeConfig({ bannerFontSize: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-purple-400/60">
                ব্যানারের ভেতরের লেখার অক্ষর বড় বা ছোট করুন।
              </p>
            </div>
          </div>

          {/* Border, Radius & Color controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <div className="flex justify-between text-purple-300/80 mb-1">
                <span>ব্যানার কর্নার রাউন্ড</span>
                <span className="font-mono text-cyan-300">
                  {config.bannerCornerRadius}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="2"
                value={config.bannerCornerRadius}
                onChange={(e) =>
                  onChangeConfig({ bannerCornerRadius: parseInt(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-purple-300/80 mb-1">
                <span>লাল বর্ডার এর প্রস্থ</span>
                <span className="font-mono text-cyan-300">
                  {config.bannerBorderWidth}px
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                step="1"
                value={config.bannerBorderWidth}
                onChange={(e) =>
                  onChangeConfig({ bannerBorderWidth: parseInt(e.target.value) })
                }
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.bannerBorderColor || '#dc2626'}
                  onChange={(e) =>
                    onChangeConfig({ bannerBorderColor: e.target.value })
                  }
                  className="w-6 h-6 rounded border border-purple-800 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-purple-200">বর্ডার কালার</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.bannerBgColor || '#ffffff'}
                  onChange={(e) =>
                    onChangeConfig({ bannerBgColor: e.target.value })
                  }
                  className="w-6 h-6 rounded border border-purple-800 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] text-purple-200">ব্যাকগ্রাউন্ড</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
