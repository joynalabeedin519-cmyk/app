import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0a0f18]/85 backdrop-blur-xl sticky top-0 z-40 w-full max-w-full overflow-x-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between w-full">
        {/* Brand Logo & Title: Clean, Soft & High-Class */}
        <div className="flex items-center gap-3.5 min-w-0">
          <BrandLogo size={42} className="ring-2 ring-blue-500/30 shadow-md shadow-blue-950/40 shrink-0 transition-transform hover:scale-105" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-nowrap">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                CYBER SENTINEL BANGLADESH
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono font-bold shrink-0 tracking-wide">
                TEAM CSB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
              সাইবার সেন্টিনেল বাংলাদেশ • অটোমেটেড নোটিশ পোস্টার স্টুডিও
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
