import React, { useEffect, useRef, useState } from 'react';
import { PosterConfig } from '../types/poster';
import { renderPoster } from '../utils/canvasRenderer';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  Download,
  Eye,
  Copy,
  Check,
  Sparkles,
  Bookmark,
  FolderOpen,
} from 'lucide-react';

interface CanvasPreviewProps {
  config: PosterConfig;
  onChangeConfig: (newConfig: Partial<PosterConfig>) => void;
  onExport: (format: 'png' | 'jpeg', resolution: number) => void;
  onCopyClipboard?: () => void;
  onOpenSaveModal?: () => void;
  onOpenSavedListModal?: () => void;
  savedCount?: number;
  copied?: boolean;
  isExporting?: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  config,
  onChangeConfig,
  onExport,
  onCopyClipboard,
  onOpenSaveModal,
  onOpenSavedListModal,
  savedCount = 0,
  copied = false,
  isExporting = false,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Re-render canvas whenever config changes
  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);
    renderPoster(canvas, config, config.resolution || 1080)
      .then(() => {
        if (!isCancelled) setIsRendering(false);
      })
      .catch((err) => {
        console.error('Error rendering poster:', err);
        if (!isCancelled) setIsRendering(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [config, canvasRef]);

  // Interactive mouse or touch drag to reposition left or right image
  const handlePointerDown = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const isLeftSide = x < rect.width / 2;

    setIsDragging(true);
    setDragSide(isLeftSide ? 'left' : 'right');
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragSide) return;

    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    if (dragSide === 'left') {
      onChangeConfig({
        leftImageOffsetX: (config.leftImageOffsetX || 0) + dx,
        leftImageOffsetY: (config.leftImageOffsetY || 0) + dy,
      });
    } else {
      onChangeConfig({
        rightImageOffsetX: (config.rightImageOffsetX || 0) + dx,
        rightImageOffsetY: (config.rightImageOffsetY || 0) + dy,
      });
    }

    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragSide(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Bar above Canvas: Clean & Soft Header with Zoom */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 border border-slate-800/80 rounded-t-2xl text-xs text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>লাইভ প্রিভিউ</span>
            <span className="text-[11px] font-mono text-slate-400">
              ({config.resolution}×{config.resolution}px)
            </span>
          </span>
          {isRendering && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 animate-pulse font-mono">
              আপডেট হচ্ছে...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800/80">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-400 hover:text-white transition border-l border-slate-800/80 ml-0.5 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport: Soft Ambient Backdrop */}
      <div
        ref={containerRef}
        className="w-full relative flex items-center justify-center p-3 sm:p-5 bg-[#070b12] border-x border-b border-slate-800/80 rounded-b-2xl overflow-hidden min-h-[360px] sm:min-h-[460px] max-h-[640px] shadow-xl shadow-black/40"
      >
        <div
          className="relative transition-transform duration-75 shadow-2xl shadow-black/90 rounded-2xl overflow-hidden border border-slate-700/50"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            maxWidth: '100%',
          }}
        >
          <canvas
            ref={canvasRef as React.RefObject<HTMLCanvasElement>}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handlePointerUp}
            className={`w-full max-w-[520px] aspect-square block bg-black cursor-grab active:cursor-grabbing select-none ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
          />
        </div>
      </div>

      {/* Primary Action & Download Toolbar: Clean, Fresh, Spacious */}
      <div className="w-full mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Move className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>ছবিতে ক্লিক বা টাচ করে পজিশন টেনে ঠিক করতে পারবেন</span>
          </div>

          {/* Quick secondary buttons (Save / Saved List / Copy) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {onOpenSaveModal && (
              <button
                type="button"
                onClick={onOpenSaveModal}
                title="বর্তমান ডিজাইন নাম দিয়ে সংরক্ষণ করুন"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer active:scale-95"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>সংরক্ষণ</span>
              </button>
            )}

            {onOpenSavedListModal && (
              <button
                type="button"
                onClick={onOpenSavedListModal}
                title="সংরক্ষিত ডিজাইনের তালিকা দেখুন"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all cursor-pointer active:scale-95"
              >
                <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>সংরক্ষিত তালিকা</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {onCopyClipboard && (
              <button
                onClick={onCopyClipboard}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  copied
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border-slate-700/60'
                }`}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{copied ? 'কপি হয়েছে!' : 'কপি'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Download Row: Soft, High-Quality Buttons */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2.5">
          <button
            onClick={() => onExport('png', 1080)}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>HD ডাউনলোড (1080px)</span>
          </button>

          <button
            onClick={() => onExport('png', 2048)}
            disabled={isExporting}
            title="Download in Ultra 2K Quality (2048×2048px)"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-700/50 hover:border-indigo-500 transition-all cursor-pointer disabled:opacity-50 active:scale-98 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>2K আল্ট্রা বাটন (2048px)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
