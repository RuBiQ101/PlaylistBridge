'use client';

import React from 'react';

interface NavbarProps {
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with Home Return */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 group transition-all duration-200 hover:opacity-95 cursor-pointer text-left"
          title="Return to Home Screen"
        >
          <div className="w-10 h-10 max-w-[40px] max-h-[40px] rounded-xl overflow-hidden border border-slate-700/60 shadow-lg shadow-emerald-950/40 shrink-0 group-hover:scale-105 group-hover:border-emerald-500/50 transition-all duration-300">
            <img
              src="/logo.jpg"
              alt="PlaylistBridge Logo"
              width={40}
              height={40}
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              className="w-10 h-10 object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-emerald-300 transition-colors">
                PlaylistBridge
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block group-hover:text-slate-300 transition-colors">
              Universal Music Migration
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
