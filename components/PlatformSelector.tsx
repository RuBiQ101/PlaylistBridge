'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  LogOut,
  ArrowRightLeft,
  Check,
  Disc3,
  Radio,
  Loader2,
} from 'lucide-react';
import { PlatformAccountDetails, PlatformAuthStatus, PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

interface PlatformSelectorProps {
  authStatus: PlatformAuthStatus | null;
  isLoading: boolean;
  selectedSource?: PlatformId;
  selectedTarget?: PlatformId;
  onProceed: (sourceId: PlatformId, targetId: PlatformId) => void;
  onBackToHome: () => void;
  onLogout: (platform: string) => void;
  onRefreshAuth?: () => void;
  onSourceChange?: (id: PlatformId) => void;
  onTargetChange?: (id: PlatformId) => void;
}

interface PlatformOption {
  id: PlatformId;
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
  selectedSource = 'youtube',
  selectedTarget = 'spotify',
  onProceed,
  onBackToHome,
  onLogout,
  onRefreshAuth,
  onSourceChange,
  onTargetChange,
}) => {
  const [sourceId, setSourceId] = useState<PlatformId>(selectedSource);
  const [targetId, setTargetId] = useState<PlatformId>(selectedTarget);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformId | null>(null);

  // Sync state if props change from parent
  useEffect(() => {
    setSourceId(selectedSource);
  }, [selectedSource]);

  useEffect(() => {
    setTargetId(selectedTarget);
  }, [selectedTarget]);

  // Platform Definitions with icons
  const platformList: PlatformOption[] = [
    {
      id: 'youtube',
      name: 'YouTube Music',
      category: 'Platform',
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
      category: 'Platform',
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
      id: 'apple',
      name: 'Apple Music',
      category: 'Platform',
      color: 'text-rose-500',
      bgColor: 'bg-rose-950/30',
      borderColor: 'border-rose-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-rose-500`} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.12 7.78l-4.14 1.22c-.37.11-.64.44-.64.83v5.6c0 1.34-1.12 2.43-2.5 2.43s-2.5-1.09-2.5-2.43c0-1.34 1.12-2.43 2.5-2.43.43 0 .84.11 1.2.3V8.81c0-.78.54-1.44 1.28-1.66l4.63-1.36c.46-.14.93.2.93.68v2.66c0 .4-.27.73-.64.83-.37-.09-.76-.18-1.12-.18z" />
        </svg>
      ),
    },
    {
      id: 'amazon',
      name: 'Amazon Music',
      category: 'Platform',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/30',
      borderColor: 'border-cyan-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-cyan-400`} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.49 0-4.73-1.05-6.3-2.73-.24-.26-.22-.66.04-.9.26-.24.66-.22.9.04C8.98 14.39 10.9 15.25 13 15.25c2.1 0 4.02-.86 5.36-2.34.24-.26.64-.28.9-.04.26.24.28.64.04.9-1.57 1.68-3.81 2.73-6.3 2.73zm3-5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-6 0c-.83 0-1.5-.67-1.5-1.5S9.17 8 10 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
    },
    {
      id: 'jiosaavn',
      name: 'JioSaavn (Jio Music)',
      category: 'Platform',
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/30',
      borderColor: 'border-teal-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => (
        <svg className={`${cls} fill-current text-teal-400`} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      category: 'Platform',
      color: 'text-orange-500',
      bgColor: 'bg-orange-950/30',
      borderColor: 'border-orange-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => <Disc3 className={`${cls} text-orange-400`} />,
    },
    {
      id: 'tidal',
      name: 'Tidal',
      category: 'Platform',
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/30',
      borderColor: 'border-sky-500/40',
      available: true,
      badge: 'Active & Ready',
      iconSvg: (cls = 'w-6 h-6') => <Radio className={`${cls} text-sky-400`} />,
    },
  ];

  const sourceConfig =
    PLATFORMS_CONFIG[sourceId] || PLATFORMS_CONFIG.youtube;
  const targetConfig =
    PLATFORMS_CONFIG[targetId] || PLATFORMS_CONFIG.spotify;

  const getAccountForPlatform = (platformId: PlatformId): PlatformAccountDetails | undefined => {
    if (!authStatus) return undefined;
    return (authStatus as any)[platformId];
  };

  const isPlatformConnected = (platformId: PlatformId): boolean => {
    const acc = getAccountForPlatform(platformId);
    return !!acc?.connected;
  };

  const isSourceConnected = isPlatformConnected(sourceId);
  const isTargetConnected = isPlatformConnected(targetId);

  const canProceed = !isLoading && sourceId !== targetId;

  // Swap Source and Destination
  const handleSwap = () => {
    const oldSource = sourceId;
    const oldTarget = targetId;
    setSourceId(oldTarget);
    setTargetId(oldSource);
    onSourceChange?.(oldTarget);
    onTargetChange?.(oldSource);
  };

  // Handle Source Select
  const handleSourceSelect = (id: PlatformId) => {
    setSourceId(id);
    onSourceChange?.(id);
    if (id === targetId) {
      const alt = platformList.find((p) => p.id !== id)?.id || 'spotify';
      setTargetId(alt);
      onTargetChange?.(alt);
    }
  };

  // Handle Target Select
  const handleTargetSelect = (id: PlatformId) => {
    setTargetId(id);
    onTargetChange?.(id);
    if (id === sourceId) {
      const alt = platformList.find((p) => p.id !== id)?.id || 'youtube';
      setSourceId(alt);
      onSourceChange?.(alt);
    }
  };

  // Handle in-place connect without full-page reloads
  const handleConnect = async (platformId: PlatformId) => {
    const cfg = PLATFORMS_CONFIG[platformId];
    if (!cfg) return;

    if (platformId === 'youtube' || platformId === 'spotify') {
      // Official OAuth requires top-level redirect
      if (typeof window !== 'undefined') {
        localStorage.setItem('playlistbridge_source', sourceId);
        localStorage.setItem('playlistbridge_target', targetId);
        window.location.href = cfg.connectUrl;
      }
      return;
    }

    // Direct in-place connect for Apple, Amazon, JioSaavn, SoundCloud, Tidal
    setConnectingPlatform(platformId);
    try {
      await fetch(cfg.connectUrl);
      onRefreshAuth?.();
    } catch (e) {
      console.error('Failed to connect platform', e);
    } finally {
      setConnectingPlatform(null);
    }
  };

  const renderConnectionCard = (
    platformId: PlatformId,
    role: 'Source' | 'Destination'
  ) => {
    const opt = platformList.find((p) => p.id === platformId) || platformList[0];
    const cfg = PLATFORMS_CONFIG[platformId] || PLATFORMS_CONFIG.youtube;
    const accountDetails = getAccountForPlatform(platformId);
    const isConnected = !!accountDetails?.connected;
    const isConnecting = connectingPlatform === platformId;

    return (
      <div
        key={platformId + role}
        className={`relative rounded-3xl p-6 glass-panel transition-all duration-300 flex flex-col justify-between border ${
          isConnected
            ? `${cfg.borderColor} bg-gradient-to-b ${cfg.bgColor} to-slate-900/50 shadow-xl`
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
        }`}
      >
        <div className="space-y-4">
          {/* Header / Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${cfg.bgColor} border ${cfg.borderColor} flex items-center justify-center shadow-lg`}
              >
                {opt.iconSvg('w-7 h-7')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{cfg.name}</h3>
                <p className="text-xs text-slate-400">{role} Platform</p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isConnected ? (
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
          {isConnected ? (
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm overflow-hidden shrink-0">
                  {accountDetails?.avatarUrl ? (
                    <img
                      src={accountDetails.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    accountDetails?.displayName?.charAt(0) ||
                    accountDetails?.channelTitle?.charAt(0) ||
                    cfg.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white line-clamp-1">
                    {accountDetails?.displayName ||
                      accountDetails?.channelTitle ||
                      `${cfg.name} Authorized`}
                  </p>
                  <p className="text-[11px] text-slate-400">Scope: {cfg.defaultScopes}</p>
                </div>
              </div>

              <button
                onClick={() => onLogout(platformId)}
                className="text-xs text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                title={`Disconnect ${cfg.name}`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your {cfg.name} account to read or export playlists and tracks.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6">
          {!isConnected ? (
            <button
              onClick={() => handleConnect(platformId)}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-lg group cursor-pointer ${
                isConnecting
                  ? 'bg-slate-800 text-slate-400 cursor-wait'
                  : platformId === 'youtube'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/40'
                  : platformId === 'spotify'
                  ? 'bg-spotify hover:bg-spotify-accent text-black shadow-emerald-950/40'
                  : platformId === 'apple'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                  : platformId === 'amazon'
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-cyan-950/40'
                  : platformId === 'jiosaavn'
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/40'
                  : platformId === 'soundcloud'
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-950/40'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950/40'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting {cfg.name}...</span>
                </>
              ) : (
                <>
                  <span>Connect {cfg.name} Account</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-1">
              <span className="text-xs text-emerald-400/90 font-medium">
                ✓ Ready for transfer
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4 py-4">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-800 transition shadow-sm cursor-pointer"
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
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
              Source: {sourceConfig.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {platformList.map((p) => {
              const isSelected = sourceId === p.id;
              const cfg = PLATFORMS_CONFIG[p.id];
              const isLinked = isPlatformConnected(p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => handleSourceSelect(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? `${cfg.borderColor} bg-gradient-to-b ${cfg.bgColor} to-slate-950 shadow-lg scale-[1.02]`
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                      {p.iconSvg('w-4 h-4')}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isLinked ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <p className="text-[9px] text-slate-400">{isLinked ? 'Connected' : 'Ready'}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Transfer Arrow & Swap Button (1 Col) */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <button
            onClick={handleSwap}
            title="Click to swap transfer direction"
            className="group w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 hover:border-spotify/80 hover:bg-slate-800 shadow-xl flex items-center justify-center text-spotify transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <ArrowRightLeft className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
          </button>
          <span className="text-[10px] text-slate-500 mt-1 font-medium hidden lg:inline">
            Click to swap
          </span>
        </div>

        {/* Destination Platform Grid (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              2. Transfer To (Destination)
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-semibold">
              Target: {targetConfig.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {platformList.map((p) => {
              const isSelected = targetId === p.id;
              const cfg = PLATFORMS_CONFIG[p.id];
              const isLinked = isPlatformConnected(p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => handleTargetSelect(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? `${cfg.borderColor} bg-gradient-to-b ${cfg.bgColor} to-slate-950 shadow-lg scale-[1.02]`
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                      {p.iconSvg('w-4 h-4')}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-spotify text-black flex items-center justify-center font-bold">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isLinked ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <p className="text-[9px] text-slate-400">{isLinked ? 'Connected' : 'Ready'}</p>
                    </div>
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
            <span className={`text-sm font-bold ${sourceConfig.color}`}>
              {sourceConfig.name}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className={`text-sm font-bold ${targetConfig.color}`}>
              {targetConfig.name}
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline">
            • Universal Audio Matching & Migration Pipeline
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            ✓ Universal Bridge Active & Ready
          </span>
        </div>
      </div>

      {/* ================= Step B: Live Account Connection Cards ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {renderConnectionCard(sourceId, 'Source')}
        {renderConnectionCard(targetId, 'Destination')}
      </div>

      {/* Bottom Step Advancement Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => onProceed(sourceId, targetId)}
          disabled={!canProceed}
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
