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
      {/* Top Bar above Canvas: Resolution & Zoom controls */}
      <div className="w-full flex items-center justify-between p-3 bg-[#0d0421] border border-purple-900/70 rounded-t-2xl text-xs text-purple-200">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            1:1 লাইভ প্রিভিউ ({config.resolution}x{config.resolution}px)
          </span>
          {isRendering && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse font-mono">
              আপডেট হচ্ছে...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#070214] rounded-lg p-0.5 border border-purple-900/60">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1 hover:text-cyan-300 transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-purple-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
              className="p-1 hover:text-cyan-300 transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-cyan-300 transition border-l border-purple-900/60 ml-0.5 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full relative flex items-center justify-center p-2.5 sm:p-5 bg-[#03000a] border-x border-b border-purple-900/70 rounded-b-xl overflow-hidden min-h-[360px] sm:min-h-[460px] max-h-[640px]"
      >
        <div
          className="relative transition-transform duration-75 shadow-2xl shadow-purple-950/80 rounded-2xl overflow-hidden border-2 border-blue-600/50"
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

      {/* Primary Action & Download Toolbar Directly Below Preview */}
      <div className="w-full mt-3 p-3 rounded-xl bg-[#0c041f] border border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-purple-300/80">
          <Move className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>ছবিতে ক্লিক বা টাচ করে পজিশন টেনে ঠিক করুন</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              title="বর্তমান ডিজাইন নাম দিয়ে সংরক্ষণ করুন"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950 transition border border-emerald-400/40 cursor-pointer active:scale-95"
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-[#180738] hover:bg-[#260c54] text-cyan-300 border border-purple-700/60 hover:border-cyan-400 transition cursor-pointer active:scale-95"
            >
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>সংরক্ষিত তালিকা</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {onCopyClipboard && (
            <button
              onClick={onCopyClipboard}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                copied
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60'
                  : 'bg-[#14082a] hover:bg-[#1f0d40] text-blue-200 border-blue-900/60'
              }`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি'}</span>
            </button>
          )}

          <button
            onClick={() => onExport('png', 1080)}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-purple-950 transition border border-blue-400/40 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HD ডাউনলোড</span>
          </button>

          <button
            onClick={() => onExport('png', 2048)}
            disabled={isExporting}
            title="Download in Ultra 2K Quality (2048x2048px)"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#200847] via-[#2f0d61] to-[#200847] hover:from-[#2c0c5e] hover:to-[#3e1280] text-cyan-300 shadow-md shadow-purple-950/80 transition border border-purple-500/60 hover:border-cyan-400 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>2K আল্ট্রা বাটন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
