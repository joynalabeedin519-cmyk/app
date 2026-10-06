import React from 'react';
import { SavedPosterProject } from '../types/poster';
import {
  FolderOpen,
  X,
  Edit3,
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Inbox,
  ArrowRight,
} from 'lucide-react';

interface SavedPostersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedPosterProject[];
  onLoadProject: (project: SavedPosterProject) => void;
  onDownloadProject: (project: SavedPosterProject, format: 'png' | 'jpeg', resolution: number) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenSaveModal: () => void;
}

export const SavedPostersListModal: React.FC<SavedPostersListModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoadProject,
  onDownloadProject,
  onDeleteProject,
  onOpenSaveModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0c031d] border-2 border-purple-600/60 rounded-2xl shadow-2xl shadow-purple-950 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/60 flex items-center justify-between bg-[#110526]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>সংরক্ষিত পোস্টারের তালিকা</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/50 font-mono">
                  {savedList.length}টি
                </span>
              </h3>
              <p className="text-[11px] text-purple-300/80">
                আপনার সেভ করা যেকোনো পোস্টার এখান থেকে আবার এডিট বা সরাসরি ডাউনলোড করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {savedList.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#180738] border border-purple-800 flex items-center justify-center text-purple-400">
                <Inbox className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">
                এখনো কোনো পোস্টার সংরক্ষিত করা হয়নি
              </h4>
              <p className="text-xs text-purple-300/70 max-w-sm mx-auto">
                আপনি যখন পোস্টার বানিয়ে <strong>"সংরক্ষণ"</strong> বাটনে চাপ দিবেন এবং নাম লিখে সেভ করবেন, তা এখানে জমা থাকবে।
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSaveModal();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>বর্তমান ডিজাইন সংরক্ষণ করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {savedList.map((project) => (
                <div
                  key={project.id}
                  className="p-3.5 rounded-xl bg-[#070114] border border-purple-900/70 hover:border-purple-600/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual Thumbnail if available */}
                    {project.thumbnailUrl ? (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-purple-700/60 shrink-0 bg-black">
                        <img
                          src={project.thumbnailUrl}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#140630] border border-purple-800/60 shrink-0 flex items-center justify-center text-purple-400">
                        <FolderOpen className="w-6 h-6 text-emerald-400" />
                      </div>
                    )}

                    {/* Title & Metadata */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {project.name}
                      </h4>
                      <p className="text-[11px] text-purple-300/80 line-clamp-1 mt-0.5 font-sans">
                        {project.config.freeformText
                          ? project.config.freeformText.replace(/\[color:[^\]]+\]/g, '').replace(/\[\/color\]/g, '')
                          : 'ডিফল্ট সাইবার সেন্টিনেল নোটিশ'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-purple-400/80 font-mono">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span>{project.dateFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-purple-900/50 shrink-0">
                    {/* Edit & Work Again Button */}
                    <button
                      type="button"
                      onClick={() => onLoadProject(project)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm border border-blue-400/40 cursor-pointer"
                      title="এই পোস্টারে আবার কাজ ও এডিট করুন"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিট করুন</span>
                    </button>

                    {/* Download HD Button */}
                    <button
                      type="button"
                      onClick={() => onDownloadProject(project, 'png', 1080)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#1a0838] hover:bg-[#280c54] text-cyan-300 border border-purple-700/60 cursor-pointer"
                      title="ডাউনলোড (HD PNG)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-purple-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/60 cursor-pointer transition"
                      title="তালিকা থেকে মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-purple-900/60 bg-[#0c031d] flex items-center justify-between text-xs text-purple-300/80">
          <span>মোট সংরক্ষিত: {savedList.length}টি ডিজাইন</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-[#150633] border border-purple-800/60 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
