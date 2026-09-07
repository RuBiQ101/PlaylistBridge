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
} from 'lucide-react';
import { PlatformAuthStatus } from '@/lib/types';

interface PlatformSelectorProps {
  authStatus: PlatformAuthStatus | null;
  isLoading: boolean;
  onProceed: () => void;
  onBackToHome: () => void;
  onLogout: (platform: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  authStatus,
  isLoading,
  onProceed,
  onBackToHome,
  onLogout,
}) => {
  const [sourcePlatform, setSourcePlatform] = useState<'youtube' | 'apple' | 'soundcloud'>('youtube');
  const [targetPlatform, setTargetPlatform] = useState<'spotify' | 'apple' | 'tidal'>('spotify');

  const isSpotifyConnected = !!authStatus?.spotify?.connected;
  const isYouTubeConnected = !!authStatus?.youtube?.connected;
  const canProceed = isSpotifyConnected && isYouTubeConnected;

  return (
    <div className="space-y-10 max-w-4xl mx-auto px-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">Select & Connect Platforms</span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Choose & Connect Platforms
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Select your source and destination streaming services, then authorize access to begin
          transferring your playlists.
        </p>
      </div>

      {/* Platform Direction Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {/* Source Selector */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Source Platform (From)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSourcePlatform('youtube')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border ${
                sourcePlatform === 'youtube'
                  ? 'bg-red-950/40 text-red-400 border-red-500/50 shadow-md shadow-red-950/50'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>YouTube Music</span>
            </button>
            <button
              disabled
              className="py-2 px-3 rounded-lg text-xs font-medium bg-slate-900/40 text-slate-600 border border-slate-800/60 cursor-not-allowed"
              title="Coming Soon"
            >
              <span>Apple Music (Soon)</span>
            </button>
          </div>
        </div>

        {/* Destination Selector */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Destination Platform (To)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTargetPlatform('spotify')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border ${
                targetPlatform === 'spotify'
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-950/50'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-spotify" />
              <span>Spotify</span>
            </button>
            <button
              disabled
              className="py-2 px-3 rounded-lg text-xs font-medium bg-slate-900/40 text-slate-600 border border-slate-800/60 cursor-not-allowed"
              title="Coming Soon"
            >
              <span>Tidal (Soon)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= YouTube Card ================= */}
        <div
          className={`relative rounded-2xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between border ${
            isYouTubeConnected
              ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-slate-900/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Header / Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/30">
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
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
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
                Connect your YouTube account to read your library playlists and liked songs.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-6">
            {!isYouTubeConnected ? (
              <a
                href="/api/auth/youtube"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/40 group"
              >
                <span>Connect YouTube Account</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="text-center py-1">
                <span className="text-xs text-emerald-400/90 font-medium">
                  Ready to read playlists
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ================= Spotify Card ================= */}
        <div
          className={`relative rounded-2xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between border ${
            isSpotifyConnected
              ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/40'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Header / Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-spotify shadow-lg shadow-emerald-950/30">
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
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
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
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-spotify hover:bg-spotify-accent text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40 group"
              >
                <span>Connect Spotify Account</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="text-center py-1">
                <span className="text-xs text-emerald-400/90 font-medium">
                  Ready to create and populate playlists
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
          <span>Continue to Select Playlist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
