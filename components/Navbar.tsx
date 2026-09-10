'use client';

import React from 'react';
import { ArrowRight, Sparkles, Music2, Home as HomeIcon } from 'lucide-react';

interface NavbarProps {
  viewMode?: 'landing' | 'platforms' | 'playlists' | 'transfer' | 'summary';
  onGoHome: () => void;
  onOpenTool?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode = 'landing',
  onGoHome,
  onOpenTool,
}) => {
  return (
    <div className="sticky top-2.5 sm:top-4 z-50 w-full px-3 sm:px-6 pointer-events-none">
      <header className="max-w-5xl mx-auto h-14 sm:h-16 px-3.5 sm:px-5 flex items-center justify-between rounded-full backdrop-blur-2xl bg-slate-950/75 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] pointer-events-auto transition-all duration-300">
        {/* Logo with Home Return */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 sm:gap-3 group transition-transform active:scale-95 cursor-pointer text-left"
          title="Return to Home Screen"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] sm:rounded-[10px] overflow-hidden border border-white/20 shadow-md shadow-emerald-950/40 shrink-0 group-hover:scale-105 transition-all duration-300 bg-slate-900">
            <img
              src="/logo.jpg"
              alt="PlaylistBridge Logo"
              width={36}
              height={36}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-emerald-300 transition-colors">
                PlaylistBridge
              </span>
              <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Universal Music Migration
            </p>
          </div>
        </button>

        {/* Right Navigation & Quick Actions */}
        <div className="flex items-center gap-2">
          {viewMode !== 'landing' && (
            <button
              onClick={onGoHome}
              className="ios-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10 transition cursor-pointer"
            >
              <HomeIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Home</span>
            </button>
          )}

          {viewMode === 'landing' ? (
            <button
              onClick={onOpenTool || onGoHome}
              className="ios-btn flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">
                {viewMode === 'platforms'
                  ? 'Step 1'
                  : viewMode === 'playlists'
                  ? 'Step 2'
                  : viewMode === 'transfer'
                  ? 'Step 3'
                  : 'Summary'}
              </span>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};
