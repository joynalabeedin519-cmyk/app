import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-purple-900/60 bg-[#090317]/95 backdrop-blur-md sticky top-0 z-40 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between w-full">
        {/* Brand Logo & Title: CYBER SENTINEL BANGLADESH */}
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size={42} className="ring-2 ring-blue-500/40 shadow-purple-950/50 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-nowrap">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 via-purple-300 to-rose-400 bg-clip-text text-transparent whitespace-nowrap">
                CYBER SENTINEL BANGLADESH
              </span>
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-600/50 font-mono font-bold shrink-0">
                TEAM CSB
              </span>
            </div>
            <p className="text-[11px] text-purple-300/80 truncate">
              সাইবার সেন্টিনেল বাংলাদেশ • অটোমেটেড নোটিশ পোস্টার স্টুডিও
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
