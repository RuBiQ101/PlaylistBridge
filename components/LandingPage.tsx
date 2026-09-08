'use client';

import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-12">
      {/* ================= Hero Section ================= */}
      <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
        {/* Release / Tech Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner text-xs font-semibold text-emerald-400 animate-fade-in">
          <Sparkles className="w-4 h-4 text-spotify" />
          <span>Universal Music Portability • 100% Free</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Move Your Playlists <br />
            <span className="bg-gradient-to-r from-emerald-400 via-spotify to-teal-200 bg-clip-text text-transparent">
              Anywhere in Seconds.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Seamlessly migrate your favorite music, playlists, and recap mixes from YouTube Music
            to Spotify with real-time audio duration matching and zero quality loss.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-spotify hover:from-emerald-400 hover:to-spotify-accent text-black font-extrabold text-base shadow-xl shadow-emerald-950/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Start Free Migration</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Supported Platforms Pills */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-400">
          <span className="text-slate-500 font-medium">Platforms:</span>
          <span className="px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> YouTube Music
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-spotify" /> Spotify
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-950/30 border border-rose-500/30 text-rose-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Apple Music (Beta)
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Amazon Music (Beta)
          </span>
          <span className="px-3 py-1 rounded-full bg-teal-950/30 border border-teal-500/30 text-teal-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> JioSaavn / Jio Music (Beta)
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 font-medium">
            SoundCloud & Tidal
          </span>
        </div>
      </section>

      {/* ================= Features Grid ================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Precision & Speed
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Traditional playlist tools miss songs or pick wrong acoustic covers. PlaylistBridge uses
            intelligent fuzzy normalization and duration tolerance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-spotify">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Noise Stripping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cleans clutter like "[Official Music Video]", "4K 60FPS", "Remastered 2024", and
              separates complex artist strings for exact catalog lookup.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">±12s Duration Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guarantees you never receive a 15-minute extended podcast or 30-second ringtone cover
              when you wanted the original studio release.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Streaming Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch your playlist build live with real-time SSE progress indicators, animated status
              badges, and instantaneous Spotify playlist creation.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Bottom CTA ================= */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Transfer Your Music?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            No credit card, no sign-up requirements, and completely free. Start moving your playlists
            now.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-2xl bg-spotify hover:bg-spotify-accent text-black font-extrabold text-base shadow-lg shadow-emerald-950/60 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Free Migration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
