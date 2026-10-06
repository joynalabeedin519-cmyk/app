import React, { useState, useRef, useEffect } from 'react';
import { PosterConfig, PresetTemplate, SavedPosterProject } from './types/poster';
import { generateSampleLeftProfileSvg, generateSampleRightTakedownSvg } from './utils/sampleImages';
import { renderPoster } from './utils/canvasRenderer';
import { NOTICE_PRESETS } from './utils/presets';
import { Header } from './components/Header';
import { CanvasPreview } from './components/CanvasPreview';
import { TextControlPanel } from './components/TextControlPanel';
import { ImageUploadPanel } from './components/ImageUploadPanel';
import { WatermarkControlPanel } from './components/WatermarkControlPanel';
import { SavePosterModal } from './components/SavePosterModal';
import { SavedPostersListModal } from './components/SavedPostersListModal';
import { processLogoBackground } from './utils/imageProcessing';
import {
  Type,
  Image as ImageIcon,
  Shield,
  Sparkles,
  Info,
  Eye,
  Sliders,
  ChevronUp,
  Save,
  FolderDown,
  FolderOpen,
  Bookmark,
} from 'lucide-react';

const STORAGE_KEY = 'csb_poster_saved_config_v1';
const SAVED_PROJECTS_KEY = 'csb_saved_posters_list_v1';

const DEFAULT_CONFIG: PosterConfig = {
  leftImageSrc: generateSampleLeftProfileSvg(),
  rightImageSrc: generateSampleRightTakedownSvg(),
  leftImageScale: 1,
  leftImageOffsetX: 0,
  leftImageOffsetY: 0,
  rightImageScale: 1,
  rightImageOffsetX: 0,
  rightImageOffsetY: 0,
  imageCornerRadius: 0,

  bannerReasonText: 'প্রতিনিয়ত হ্যা,রেস,মেন্ট করার অ,প,রা,ধে',
  bannerActionText: 'একটি আইডি রি,মু,ভ করা হলো ',
  bannerTeamText: 'TEAM CSB',
  bannerFooterText: 'পক্ষ থেকে।',

  useFreeformBanner: true,
  freeformText:
    'প্রতিনিয়ত হ্যা,রেস,মেন্ট করার অ,প,রা,ধে\nএকটি আইডি রি,মু,ভ করা হলো [color:#dc2626]TEAM CSB[/color]\nপক্ষ থেকে।',

  bannerBgColor: '#ffffff',
  bannerBorderColor: '#dc2626',
  bannerBorderWidth: 10,
  bannerCornerRadius: 24,
  bannerTextColor: '#000000',
  bannerTeamColor: '#dc2626',
  bannerLine1Color: '#000000',
  bannerLine2Color: '#000000',
  bannerLine3Color: '#000000',
  bannerFontSize: 1,
  bannerHeightScale: 1,
  bannerFontFamily: 'Hind Siliguri',
  bannerFontWeight: '800',
  bannerBottomMargin: 18,

  outerBorderColor: '#dc2626',
  outerBorderWidth: 12,
  frameCornerRadius: 26,
  dividerColor: '#dc2626',
  dividerWidth: 8,
  canvasBgColor: '#001a22',

  showEmblem: true,
  emblemOpacity: 0.88,
  emblemScale: 1.05,
  emblemOffsetY: 0,
  emblemBlendMode: 'normal',
  emblemRemoveOuterWhite: true,
  emblemRemoveDarkBg: false,
  emblemDarkThreshold: 30,
  watermarkTitle: 'CYBER SENTINEL',
  watermarkSubtitle: 'BANGLADESH',
  watermarkTitleColor: '#a5f3fc',
  watermarkSubtitleColor: '#f87171',
  customEmblemSrc: '/csb-logo.jpg',
  processedCustomEmblemSrc: null,

  resolution: 1080,
};

export default function App() {
  const [config, setConfig] = useState<PosterConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'watermark'>('text');
  const [mobileView, setMobileView] = useState<'preview' | 'editor'>('editor');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // List of Saved Projects with names, thumbnails, timestamps
  const [savedProjects, setSavedProjects] = useState<SavedPosterProject[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_PROJECTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const editorSectionRef = useRef<HTMLDivElement>(null);

  // Pre-process emblem immediately on mount so watermark never displays white square corners
  useEffect(() => {
    const emblemSrc = config.customEmblemSrc || '/csb-logo.jpg';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const transparentDataUrl = processLogoBackground(img, {
        removeOuterWhite: true,
        removeDarkBackground: false,
        darkThreshold: 30,
        clipToCircle: true,
      });
      setConfig((prev) => ({
        ...prev,
        processedCustomEmblemSrc: transparentDataUrl,
      }));
    };
    img.src = emblemSrc;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Open Save Modal (called when user clicks "সংরক্ষিত")
  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  // Confirm Save with user provided custom name and canvas thumbnail
  const handleConfirmSaveProject = (projectName: string) => {
    const id = 'proj_' + Date.now();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let thumbUrl: string | undefined = undefined;
    try {
      if (canvasRef.current) {
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 140;
        thumbCanvas.height = 140;
        const ctx = thumbCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvasRef.current, 0, 0, 140, 140);
          thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.65);
        }
      }
    } catch (e) {
      console.warn('Thumbnail generation skipped:', e);
    }

    const newProject: SavedPosterProject = {
      id,
      name: projectName,
      timestamp: Date.now(),
      dateFormatted,
      thumbnailUrl: thumbUrl,
      config: { ...config },
    };

    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    try {
      localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(updated));
    } catch (e) {
      // If quota reached due to big image URLs, save without thumbnail
      const lightList = updated.map((p) => ({ ...p, thumbnailUrl: undefined }));
      try {
        localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(lightList));
      } catch (err) {
        console.error('Storage full:', err);
      }
    }

    setIsSaveModalOpen(false);
    showToast(`✓ '${projectName}' সফলভাবে সংরক্ষিত তালিকায় যোগ করা হয়েছে!`);
  };

  // Load a saved project into active studio to work and edit again anytime!
  const handleLoadProject = (project: SavedPosterProject) => {
    setConfig({ ...project.config });
    setIsListModalOpen(false);
    showToast(`✓ '${project.name}' এডিট করার জন্য স্টুডিওতে লোড করা হয়েছে!`);
  };

  // Download directly from the saved list
  const handleDownloadSavedProject = async (
    project: SavedPosterProject,
    format: 'png' | 'jpeg',
    res: number = 1080
  ) => {
    try {
      const exportCanvas = document.createElement('canvas');
      await renderPoster(exportCanvas, project.config, res);
      const link = document.createElement('a');
      link.download = `CSB-${project.name.replace(/\s+/g, '_')}-${res}px.${format}`;
      link.href = exportCanvas.toDataURL(`image/${format}`, 0.95);
      link.click();
      showToast(`✓ '${project.name}' ডাউনলোড শুরু হয়েছে!`);
    } catch (err) {
      console.error('Failed to download project:', err);
      showToast('ডাউনলোড করতে সমস্যা হয়েছে');
    }
  };

  // Delete project from saved list
  const handleDeleteProject = (projectId: string) => {
    const updated = savedProjects.filter((p) => p.id !== projectId);
    setSavedProjects(updated);
    try {
      localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast('পোস্টারটি তালিকা থেকে মুছে ফেলা হয়েছে');
  };

  const handleUpdateConfig = (newSettings: Partial<PosterConfig>) => {
    setConfig((prev) => ({ ...prev, ...newSettings }));
  };

  const handleApplyPreset = (preset: PresetTemplate) => {
    setConfig((prev) => ({
      ...prev,
      freeformText: preset.freeformText,
      useFreeformBanner: true,
    }));
    showToast(`প্রিসেট লোড হয়েছে: ${preset.nameBn}`);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    showToast('সব সেটিং ডিফল্ট মানে রিসেট করা হয়েছে');
  };

  const handleLoadReferenceMockup = () => {
    setConfig((prev) => ({
      ...prev,
      leftImageSrc: generateSampleLeftProfileSvg(),
      rightImageSrc: generateSampleRightTakedownSvg(),
      leftImageScale: 1,
      leftImageOffsetX: 0,
      leftImageOffsetY: 0,
      rightImageScale: 1,
      rightImageOffsetX: 0,
      rightImageOffsetY: 0,
      freeformText:
        'প্রতিনিয়ত হ্যা,রেস,মেন্ট করার অ,প,রা,ধে\nএকটি আইডি রি,মু,ভ করা হলো [color:#dc2626]TEAM CSB[/color]\nপক্ষ থেকে।',
      watermarkTitle: 'CYBER SENTINEL',
      watermarkSubtitle: 'BANGLADESH',
      customEmblemSrc: '/csb-logo.jpg',
      showEmblem: true,
      useFreeformBanner: true,
    }));
    showToast('মূল রেফারেন্স পোস্টার স্যাম্পল লোড করা হয়েছে');
  };

  // High-Resolution Export to PNG or JPEG
  const handleExport = async (format: 'png' | 'jpeg', targetRes: number = 1080) => {
    setIsExporting(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await renderPoster(exportCanvas, config, targetRes);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataUrl = exportCanvas.toDataURL(mimeType, 0.95);

      const link = document.createElement('a');
      link.download = `Cyber-Sentinel-Bangladesh-${targetRes}x${targetRes}.${format}`;
      link.href = dataUrl;
      link.click();

      showToast(`পোস্টার সফলভাবে ডাউনলোড হয়েছে (${targetRes}x${targetRes}px)`);
    } catch (err) {
      console.error('Export failed:', err);
      showToast('ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard as Image
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      const exportCanvas = document.createElement('canvas');
      await renderPoster(exportCanvas, config, 1080);

      exportCanvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopied(true);
          showToast('পোস্টার ক্লিপবোর্ডে কপি হয়েছে!');
          setTimeout(() => setCopied(false), 2500);
        } catch (e) {
          console.warn('Clipboard write failed:', e);
          showToast('ক্লিপবোর্ড অনুমতি দেয়নি। ডাউনলোড বাটন ব্যবহার করুন।');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  const scrollToPreview = () => {
    previewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEditor = () => {
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05010e] bg-gradient-to-b from-[#0a0319] via-[#05010e] to-[#04010a] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#13072b]/95 border border-purple-500/50 shadow-2xl shadow-purple-950 text-xs sm:text-sm text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Clean Header */}
      <Header />

      {/* Mobile-Only Switcher Bar (Resolves Mobile Scrolling & Quick Actions) */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-[#0c041d]/95 border-b border-purple-900/60 p-2 backdrop-blur-md">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2 bg-[#05010e] p-1 rounded-xl border border-purple-900/40">
          <button
            onClick={() => {
              setMobileView('editor');
              scrollToEditor();
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>এডিটর</span>
          </button>

          <button
            onClick={() => {
              setMobileView('preview');
              scrollToPreview();
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>লাইভ প্রিভিউ</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start w-full max-w-full">
          {/* =======================================================
              Left / Preview Column:
              CRITICAL FIX: Uses lg:sticky lg:top-20 ONLY on large screens!
              On mobile devices, it uses normal relative flow so scrolling
              up or down never gets stuck or frozen.
             ======================================================= */}
          <div
            ref={previewSectionRef}
            className={`lg:col-span-6 xl:col-span-6 flex flex-col items-center relative lg:sticky lg:top-20 z-10 transition-all w-full max-w-full ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <CanvasPreview
              config={config}
              onChangeConfig={handleUpdateConfig}
              onExport={handleExport}
              onCopyClipboard={handleCopyClipboard}
              onOpenSaveModal={handleOpenSaveModal}
              onOpenSavedListModal={() => setIsListModalOpen(true)}
              savedCount={savedProjects.length}
              copied={copied}
              isExporting={isExporting}
              canvasRef={canvasRef}
            />

            {/* Quick Reference Summary */}
            <div className="w-full mt-3 p-3.5 rounded-xl bg-[#0e0524]/80 border border-purple-900/50 text-xs text-purple-200/80 flex items-start gap-2.5 shadow-sm">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-0.5">
                  CYBER SENTINEL BANGLADESH পোস্টার স্টুডিও
                </p>
                <p className="text-purple-300/80 leading-relaxed">
                  মোবাইলে ছবি বা টেক্সট এডিট করতে উপরের <strong>"এডিটর ও টেক্সট"</strong> বাটনে ট্যাপ করুন। এডিট করার সাথে সাথে লাইভ প্রিভিউ স্বয়ংক্রিয়ভাবে আপডেট হবে।
                </p>
              </div>
            </div>
          </div>

          {/* =======================================================
              Right / Controls Column:
              Takes full view on mobile when in 'editor' mode,
              and side-by-side on desktop.
             ======================================================= */}
          <div
            ref={editorSectionRef}
            className={`lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-5 transition-all w-full max-w-full ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Tabs Header: Guaranteed to fit in 1 line on any mobile */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0c041f] border border-purple-900/60 shadow-lg w-full max-w-full">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold transition cursor-pointer min-w-0 ${
                  activeTab === 'text'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-950'
                    : 'text-purple-300/70 hover:text-white hover:bg-[#150733]'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span className="truncate hidden sm:inline">১. ব্যানার টেক্সট</span>
                <span className="truncate sm:hidden">১. টেক্সট</span>
              </button>

              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold transition cursor-pointer min-w-0 ${
                  activeTab === 'images'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-950'
                    : 'text-purple-300/70 hover:text-white hover:bg-[#150733]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span className="truncate hidden sm:inline">২. ছবি আপলোড</span>
                <span className="truncate sm:hidden">২. ছবি</span>
              </button>

              <button
                onClick={() => setActiveTab('watermark')}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2.5 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold transition cursor-pointer min-w-0 ${
                  activeTab === 'watermark'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-950'
                    : 'text-purple-300/70 hover:text-white hover:bg-[#150733]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span className="truncate hidden sm:inline">৩. ওয়াটারমার্ক</span>
                <span className="truncate sm:hidden">৩. লোগো</span>
              </button>
            </div>

            {/* Tab Contents with smooth scrolling */}
            <div className="transition-all duration-150">
              {activeTab === 'text' && (
                <TextControlPanel
                  config={config}
                  onChangeConfig={handleUpdateConfig}
                  onApplyPreset={handleApplyPreset}
                />
              )}

              {activeTab === 'images' && (
                <ImageUploadPanel
                  config={config}
                  onChangeConfig={handleUpdateConfig}
                />
              )}

              {activeTab === 'watermark' && (
                <WatermarkControlPanel
                  config={config}
                  onChangeConfig={handleUpdateConfig}
                />
              )}
            </div>

            {/* Mobile Floating Quick Button to Check Preview */}
            <div className="lg:hidden pt-4 pb-8 flex justify-center">
              <button
                onClick={() => {
                  setMobileView('preview');
                  scrollToPreview();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white font-bold text-sm shadow-xl shadow-purple-950/80 border border-purple-500/40 cursor-pointer active:scale-98 transition"
              >
                <Eye className="w-4 h-4 text-cyan-300" />
                <span>লাইভ পোস্টার প্রিভিউ দেখুন ↗</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Watermark Credit linking to Telegram Bot */}
      <footer className="w-full py-6 mt-6 border-t border-purple-900/40 bg-[#04010a]/90 flex flex-col items-center justify-center text-center">
        <a
          href="https://t.me/Rye_Flux_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d0421] hover:bg-[#1a083b] border border-purple-700/60 hover:border-cyan-400 shadow-lg shadow-purple-950/70 hover:shadow-cyan-950/50 transition-all duration-200 cursor-pointer active:scale-95"
          title="ক্লিক করে টেলিগ্রাম বট খুলুন (@Rye_Flux_bot)"
        >
          {/* Telegram Icon */}
          <svg
            className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.44 3.8-1.58 4.59-1.86 5.11-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.16-.03.22z" />
          </svg>
          <span className="text-xs font-mono font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-300 transition-colors">
            Made by Rye Flux (@Rye_Flux_bot)
          </span>
        </a>
        <p className="text-[10px] text-purple-400/50 mt-2 font-mono tracking-wider select-none">
          CYBER SENTINEL BANGLADESH • OFFICIAL NOTICE STUDIO
        </p>
      </footer>

      {/* Save with Custom Name Modal */}
      <SavePosterModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirmSave={handleConfirmSaveProject}
        defaultName="হ্যারাসমেন্ট রিমুভ নোটিশ"
      />

      {/* Saved Projects List Modal */}
      <SavedPostersListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        savedList={savedProjects}
        onLoadProject={handleLoadProject}
        onDownloadProject={handleDownloadSavedProject}
        onDeleteProject={handleDeleteProject}
        onOpenSaveModal={handleOpenSaveModal}
      />
    </div>
  );
}
