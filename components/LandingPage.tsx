'use client';

import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';

import { PlatformId } from '@/lib/types';

interface LandingPageProps {
  onGetStarted: () => void;
  onSelectPlatform?: (platform: PlatformId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSelectPlatform,
}) => {
  const handlePlatformClick = (p: PlatformId) => {
    if (onSelectPlatform) {
      onSelectPlatform(p);
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="space-y-10 sm:space-y-16 py-3 sm:py-8">
      {/* ================= Hero Section ================= */}
      <section className="text-center space-y-5 sm:space-y-7 max-w-3xl mx-auto px-3 sm:px-4">
        {/* Release / Tech Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ios-pill bg-slate-900/80 text-[11px] font-bold text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-spotify animate-pulse" />
          <span>Universal Music Portability • 100% Free</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2.5 sm:space-y-3">
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Move Your Playlists <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Anywhere in Seconds.
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Seamlessly migrate your favorite music between YouTube Music, Spotify, Amazon Music, and JioSaavn with real-time audio duration matching and zero quality loss.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={onGetStarted}
            className="ios-btn w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Start Free Migration</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Supported Platforms Pills */}
        <div className="pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-medium text-[11px]">Select Platform:</span>
          <button
            onClick={() => handlePlatformClick('youtube')}
            className="ios-btn ios-pill px-3 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> YouTube Music
          </button>
          <button
            onClick={() => handlePlatformClick('spotify')}
            className="ios-btn ios-pill px-3 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-spotify animate-pulse" /> Spotify
          </button>
          <button
            onClick={() => handlePlatformClick('amazon')}
            className="ios-btn ios-pill px-3 py-1.5 rounded-full bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 font-medium text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Amazon Music
          </button>
          <button
            onClick={() => handlePlatformClick('jiosaavn')}
            className="ios-btn ios-pill px-3 py-1.5 rounded-full bg-teal-950/30 hover:bg-teal-900/50 border border-teal-500/30 text-teal-400 font-medium text-[11px] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> JioSaavn
          </button>
        </div>
      </section>

      {/* ================= Features Grid ================= */}
      <section className="max-w-5xl mx-auto px-3 sm:px-4">
        <div className="text-center space-y-1.5 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Engineered for Precision & Speed
          </h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Traditional playlist tools miss songs or pick wrong covers. PlaylistBridge uses intelligent fuzzy normalization and duration tolerance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Card 1 */}
          <div className="p-4 sm:p-5 rounded-[22px] ios-bubble-card space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-spotify">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Smart Noise Stripping</h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Cleans clutter like "[Official Music Video]", "4K 60FPS", "Remastered", and separates complex artist strings for exact catalog lookup.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-5 rounded-[22px] ios-bubble-card space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">±12s Duration Verification</h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Guarantees you never receive a 15-minute extended podcast or 30-second ringtone cover when you wanted the original studio release.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-5 rounded-[22px] ios-bubble-card space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Real-Time Streaming Engine</h3>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              Watch your playlist build live with real-time SSE progress indicators, animated status badges, and instantaneous playlist creation.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Bottom CTA ================= */}
      <section className="max-w-3xl mx-auto px-3 sm:px-4">
        <div className="p-5 sm:p-8 rounded-[28px] ios-bubble-card text-center space-y-4 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Ready to Transfer Your Music?
          </h2>
          <p className="text-slate-300 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            No credit card, no sign-up requirements, and completely free. Start moving your playlists now.
          </p>
          <button
            onClick={onGetStarted}
            className="ios-btn px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Free Migration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
