'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Sparkles,
  ArrowRightLeft,
  Music2,
  Disc3,
  Check,
  Zap,
} from 'lucide-react';
import { PlatformAuthStatus } from '@/lib/types';

interface PlatformSelectorProps {
  authStatus: PlatformAuthStatus | null;
  isLoading: boolean;
  onProceed: () => void;
  onBackToHome: () => void;
  onLogout: (platform: string) => void;
}

interface PlatformOption {
  id: string;
  name: string;
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  available: boolean;
  badge?: string;
  iconSvg: (className?: string) => React.ReactNode;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  authStatus,
  isLoading,
  onProceed,
  onBackToHome,
  onLogout,
}) => {
  const [sourceId, setSourceId] = useState<string>('youtube');
  const [targetId, setTargetId] = useState<string>('spotify');

  const isSpotifyConnected = !!authStatus?.spotify?.connected;
  const isYouTubeConnected = !!authStatus?.youtube?.connected;

  const isSupportedRoute = sourceId === 'youtube' && targetId === 'spotify';
  const canProceed = isSupportedRoute && isSpotifyConnected && isYouTubeConnected;

  // Source Platform List
  const sourcePlatforms: PlatformOption[] = [
    {
      id: 'youtube',
      name: 'YouTube Music',
      category: 'Source',
      color: 'text-red-500',
      bgColor: 'bg-red-950/30',
      borderColor: 'border-red-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-red-500`} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'spotify',
      name: 'Spotify',
      category: 'Source',
      color: 'text-spotify',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-500/40',
      available: false,
      badge: 'Rollout Next',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-spotify`} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.306a.82.82 0 0 1-1.127.273c-3.08-1.884-6.958-2.31-11.522-1.267a.82.82 0 1 1-.366-1.599c5.006-1.144 9.29-.661 12.742 1.466a.82.82 0 0 1 .273 1.127zm1.611-3.585a1.025 1.025 0 0 1-1.41.338c-3.524-2.166-8.898-2.793-13.064-1.529a1.025 1.025 0 1 1-.595-1.962c4.757-1.444 10.678-.748 14.73 1.743a1.025 1.025 0 0 1 .339 1.41zm.143-3.738C15.06 7.472 8.643 7.26 4.938 8.384a1.23 1.23 0 0 1-.722-2.353c4.256-1.292 11.341-1.045 15.986 1.71a1.23 1.23 0 1 1-1.281 2.097z" />
        </svg>
      ),
    },
    {
      id: 'apple',
      name: 'Apple Music',
      category: 'Source',
      color: 'text-pink-500',
      bgColor: 'bg-pink-950/30',
      borderColor: 'border-pink-500/40',
      available: false,
      badge: 'Coming Soon',
      iconSvg: (cls = 'w-6 h-6') => <Music2 className={`${cls} text-pink-400`} />,
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      category: 'Source',
      color: 'text-orange-500',
      bgColor: 'bg-orange-950/30',
      borderColor: 'border-orange-500/40',
      available: false,
      badge: 'Coming Soon',
      iconSvg: (cls = 'w-6 h-6') => <Disc3 className={`${cls} text-orange-400`} />,
    },
  ];

  // Destination Platform List
  const targetPlatforms: PlatformOption[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      category: 'Destination',
      color: 'text-spotify',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-spotify`} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.306a.82.82 0 0 1-1.127.273c-3.08-1.884-6.958-2.31-11.522-1.267a.82.82 0 1 1-.366-1.599c5.006-1.144 9.29-.661 12.742 1.466a.82.82 0 0 1 .273 1.127zm1.611-3.585a1.025 1.025 0 0 1-1.41.338c-3.524-2.166-8.898-2.793-13.064-1.529a1.025 1.025 0 1 1-.595-1.962c4.757-1.444 10.678-.748 14.73 1.743a1.025 1.025 0 0 1 .339 1.41zm.143-3.738C15.06 7.472 8.643 7.26 4.938 8.384a1.23 1.23 0 0 1-.722-2.353c4.256-1.292 11.341-1.045 15.986 1.71a1.23 1.23 0 1 1-1.281 2.097z" />
        </svg>
      ),
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      category: 'Destination',
      color: 'text-red-500',
      bgColor: 'bg-red-950/30',
      borderColor: 'border-red-500/40',
      available: false,
      badge: 'Rollout Next',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-red-500`} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: 'apple',
      name: 'Apple Music',
      category: 'Destination',
      color: 'text-pink-500',
      bgColor: 'bg-pink-950/30',
      borderColor: 'border-pink-500/40',
      available: false,
      badge: 'Coming Soon',
      iconSvg: (cls = 'w-6 h-6') => <Music2 className={`${cls} text-pink-400`} />,
    },
    {
      id: 'tidal',
      name: 'Tidal',
      category: 'Destination',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/30',
      borderColor: 'border-cyan-500/40',
      available: false,
      badge: 'Coming Soon',
      iconSvg: (cls = 'w-6 h-6') => <Disc3 className={`${cls} text-cyan-400`} />,
    },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-4">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Select Transfer Direction</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Where would you like to transfer your music?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Choose the source platform where your playlists currently live, and the destination
          platform you want to migrate them to.
        </p>
      </div>

      {/* ================= Step A: Visual Route Selector Grid ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* Source Platform Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              1. Transfer From (Source)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-950/40 text-red-400 border border-red-500/20 font-medium">
              Source
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sourcePlatforms.map((p) => {
              const isSelected = sourceId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => p.available && setSourceId(p.id)}
                  disabled={!p.available}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[105px] ${
                    isSelected
                      ? 'border-red-500/80 bg-gradient-to-b from-red-950/40 to-slate-950 shadow-lg shadow-red-950/40 scale-[1.02]'
                      : p.available
                      ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer'
                      : 'border-slate-900 bg-slate-950/30 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {p.iconSvg('w-5 h-5')}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Transfer Arrow (1 Col) */}
        <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 shadow-xl flex items-center justify-center text-spotify animate-pulse">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Destination Platform Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              2. Transfer To (Destination)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-medium">
              Destination
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {targetPlatforms.map((p) => {
              const isSelected = targetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => p.available && setTargetId(p.id)}
                  disabled={!p.available}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[105px] ${
                    isSelected
                      ? 'border-emerald-500/80 bg-gradient-to-b from-emerald-950/40 to-slate-950 shadow-lg shadow-emerald-950/40 scale-[1.02]'
                      : p.available
                      ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer'
                      : 'border-slate-900 bg-slate-950/30 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {p.iconSvg('w-5 h-5')}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-spotify text-black flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Route Summary Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/20 via-slate-900 to-emerald-950/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-red-400">YouTube Music</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold text-spotify">Spotify</span>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline">
            • Full Playlist & Liked Songs Transfer
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-semibold border ${
              isYouTubeConnected && isSpotifyConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            {isYouTubeConnected && isSpotifyConnected
              ? '✓ Both Accounts Connected'
              : 'Action Required: Connect Accounts Below'}
          </span>
        </div>
      </div>

      {/* ================= Step B: Live Account Connection Cards ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* ================= YouTube Card ================= */}
        <div
          className={`relative rounded-3xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between border ${
            isYouTubeConnected
              ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-slate-900/50'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
        >
          <div className="space-y-4">
            {/* Header / Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/30">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">YouTube Music</h3>
                  <p className="text-xs text-slate-400">Source Platform</p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isYouTubeConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isYouTubeConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile or Description */}
            {isYouTubeConnected ? (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-sm overflow-hidden">
                    {authStatus?.youtube?.avatarUrl ? (
                      <img
                        src={authStatus.youtube.avatarUrl}
                        alt="Channel"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      authStatus?.youtube?.channelTitle?.charAt(0) || 'Y'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {authStatus?.youtube?.channelTitle || 'Authorized Channel'}
                    </p>
                    <p className="text-[11px] text-slate-400">Scope: youtube.readonly</p>
                  </div>
                </div>
                <button
                  onClick={() => onLogout('youtube')}
                  className="text-xs text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition"
                  title="Disconnect YouTube"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your YouTube account to read your playlists, mixes, and liked music.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6">
            {!isYouTubeConnected ? (
              <a
                href="/api/auth/youtube"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/40 group"
              >
                <span>Connect YouTube Account</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="text-center py-1">
                <span className="text-xs text-emerald-400/90 font-medium">
                  ✓ Ready to read playlists
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ================= Spotify Card ================= */}
        <div
          className={`relative rounded-3xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between border ${
            isSpotifyConnected
              ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/50'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          }`}
        >
          <div className="space-y-4">
            {/* Header / Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-spotify shadow-lg shadow-emerald-950/30">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.306a.82.82 0 0 1-1.127.273c-3.08-1.884-6.958-2.31-11.522-1.267a.82.82 0 1 1-.366-1.599c5.006-1.144 9.29-.661 12.742 1.466a.82.82 0 0 1 .273 1.127zm1.611-3.585a1.025 1.025 0 0 1-1.41.338c-3.524-2.166-8.898-2.793-13.064-1.529a1.025 1.025 0 1 1-.595-1.962c4.757-1.444 10.678-.748 14.73 1.743a1.025 1.025 0 0 1 .339 1.41zm.143-3.738C15.06 7.472 8.643 7.26 4.938 8.384a1.23 1.23 0 0 1-.722-2.353c4.256-1.292 11.341-1.045 15.986 1.71a1.23 1.23 0 1 1-1.281 2.097z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Spotify</h3>
                  <p className="text-xs text-slate-400">Destination Platform</p>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isSpotifyConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {isSpotifyConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile or Description */}
            {isSpotifyConnected ? (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden">
                    {authStatus?.spotify?.avatarUrl ? (
                      <img
                        src={authStatus.spotify.avatarUrl}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      authStatus?.spotify?.displayName?.charAt(0) || 'S'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {authStatus?.spotify?.displayName || 'Spotify User'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Scope: playlist-modify-private & public
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onLogout('spotify')}
                  className="text-xs text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition"
                  title="Disconnect Spotify"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Spotify account to create new playlists and populate matched tracks.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6">
            {!isSpotifyConnected ? (
              <a
                href="/api/auth/spotify"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-spotify hover:bg-spotify-accent text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40 group"
              >
                <span>Connect Spotify Account</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="text-center py-1">
                <span className="text-xs text-emerald-400/90 font-medium">
                  ✓ Ready to create playlists
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Step Advancement Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onProceed}
          disabled={!canProceed || isLoading}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-emerald-500 to-spotify hover:from-emerald-400 hover:to-spotify-accent text-black shadow-lg shadow-emerald-950/50 cursor-pointer scale-100 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <span>Continue to Select Playlists</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
