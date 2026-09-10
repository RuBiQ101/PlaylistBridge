'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Music,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ListMusic,
  Edit3,
  Link,
  Heart,
  Plus,
  Loader2,
} from 'lucide-react';
import { GenericPlaylist, PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';
import { PlatformAuthStatus } from '@/lib/types';

interface StepSelectPlaylistProps {
  sourcePlatform?: PlatformId;
  targetPlatform?: PlatformId;
  authStatus?: PlatformAuthStatus | null;
  onBack: () => void;
  onSelectAndStart: (playlist: GenericPlaylist, customName: string) => void;
}

export const StepSelectPlaylist: React.FC<StepSelectPlaylistProps> = ({
  sourcePlatform = 'youtube',
  targetPlatform = 'spotify',
  authStatus,
  onBack,
  onSelectAndStart,
}) => {
  const [playlists, setPlaylists] = useState<GenericPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<GenericPlaylist | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Direct URL Import State
  const [urlInput, setUrlInput] = useState<string>('');
  const [isImportingUrl, setIsImportingUrl] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);


  const sourceConfig = PLATFORMS_CONFIG[sourcePlatform] || PLATFORMS_CONFIG.youtube;
  const targetConfig = PLATFORMS_CONFIG[targetPlatform] || PLATFORMS_CONFIG.spotify;
  const sourceName = sourceConfig.name;
  const targetName = targetConfig.name;

  const fetchPlaylists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = `/api/playlists/${sourcePlatform}`;
      const res = await fetch(endpoint);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to load ${sourceName} playlists`);
      }
      const data = await res.json();
      setPlaylists(data.playlists || []);
      if (data.playlists && data.playlists.length > 0) {
        setSelectedPlaylist(data.playlists[0]);
        setCustomName(`[Migrated] ${data.playlists[0].title}`);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [sourcePlatform]);

  const handleSelect = (playlist: GenericPlaylist) => {
    setSelectedPlaylist(playlist);
    setCustomName(`[Migrated] ${playlist.title}`);
  };

  const handleImportByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsImportingUrl(true);
    setImportError(null);
    try {
      const endpoint = `/api/playlists/${sourcePlatform}/lookup`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: urlInput.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Could not find ${sourceName} playlist`);
      }

      const data = await res.json();
      if (data.playlist) {
        setPlaylists((prev) => {
          const exists = prev.some((p) => p.id === data.playlist.id);
          return exists ? prev : [data.playlist, ...prev];
        });
        handleSelect(data.playlist);
        setUrlInput('');
      }
    } catch (err: any) {
      setImportError(err.message || 'Failed to import playlist link');
    } finally {
      setIsImportingUrl(false);
    }
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalLibrarySongs = playlists.reduce((acc, p) => acc + (p.itemCount || 0), 0);
  const totalFilteredSongs = filteredPlaylists.reduce((acc, p) => acc + (p.itemCount || 0), 0);

  const isConnected =
    sourcePlatform === 'youtube'
      ? !!authStatus?.youtube?.connected
      : sourcePlatform === 'spotify'
      ? !!authStatus?.spotify?.connected
      : sourcePlatform === 'amazon'
      ? !!authStatus?.amazon?.connected
      : !!authStatus?.jiosaavn?.connected;

  const userDisplayName =
    sourcePlatform === 'youtube'
      ? authStatus?.youtube?.displayName || authStatus?.youtube?.channelTitle
      : sourcePlatform === 'spotify'
      ? authStatus?.spotify?.displayName
      : sourcePlatform === 'amazon'
      ? authStatus?.amazon?.displayName
      : authStatus?.jiosaavn?.displayName;

  return (
    <div className="space-y-5 sm:space-y-7 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ios-pill bg-slate-900/80 text-[11px] font-bold text-slate-300 mb-1.5">
            <ListMusic className={`w-3.5 h-3.5 ${sourceConfig.color}`} />
            <span>Step 2 of 4 • Select Source Playlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Choose a {sourceName} Playlist
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Select from your {sourceName} library or paste any playlist link to transfer to {targetName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlaylists}
            disabled={isLoading}
            className="ios-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Library Sync & Account Status Banner */}
      <div className="p-3 sm:p-4 rounded-[22px] ios-bubble-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {isConnected
                  ? `Connected: ${userDisplayName || `${sourceName} Account`}`
                  : `Curated ${sourceName} Library`}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-white/10 text-slate-300 font-semibold">
                {playlists.length} Playlists • {totalLibrarySongs.toLocaleString()} Songs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isConnected
                ? `Synchronized live with your ${sourceName} cloud account.`
                : `Showing library playlists (including "my mix 1", "Chill", "playback", "Music").`}
            </p>
          </div>
        </div>

        {!isConnected && (
          <a
            href={sourceConfig.connectUrl}
            className={`ios-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md cursor-pointer shrink-0 ${
              sourcePlatform === 'youtube'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <span>Connect Account</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Paste Playlist URL Bar */}
      <div className="p-3 sm:p-4 rounded-[22px] ios-bubble-card space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Link className={`w-3.5 h-3.5 ${sourceConfig.color}`} />
          <span>Import Any {sourceName} Link or ID</span>
        </div>
        <form onSubmit={handleImportByUrl} className="flex gap-2">
          <input
            type="text"
            placeholder={
              sourcePlatform === 'jiosaavn'
                ? 'Paste JioSaavn link (e.g., https://www.jiosaavn.com/featured/...)'
                : sourcePlatform === 'spotify'
                ? 'Paste Spotify playlist URL or URI'
                : sourcePlatform === 'amazon'
                ? 'Paste Amazon Music playlist URL'
                : 'Paste YouTube Music playlist link or ID'
            }
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3.5 py-2 bg-slate-950/80 border border-white/10 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isImportingUrl || !urlInput.trim()}
            className="ios-btn px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isImportingUrl ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            <span>Import</span>
          </button>
        </form>
        {importError && <p className="text-xs text-red-400">{importError}</p>}
      </div>

      {/* Search and Filters */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Filter ${sourceName} playlists...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-white/10 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-spotify/60 transition"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredPlaylists.length}</strong> of{' '}
            <strong className="text-white">{playlists.length}</strong> playlists
          </span>
          <span>
            <strong className="text-emerald-400">{totalFilteredSongs.toLocaleString()}</strong> songs
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchPlaylists}
            className="px-3 py-1 bg-red-900/50 hover:bg-red-800/50 rounded-full text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Playlist Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-[22px] bg-slate-900/40 border border-slate-800/60 p-3 space-y-2 animate-pulse"
            >
              <div className="w-full aspect-[16/10] rounded-xl bg-slate-800" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="text-center py-10 p-6 rounded-[24px] border border-dashed border-slate-800 bg-slate-900/20">
          <Music className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-white font-semibold text-xs">No playlists found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Try importing via link above or refresh your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlaylists.map((pl) => {
            const isSelected = selectedPlaylist?.id === pl.id;
            const isLikedMusic =
              pl.id === 'LM' ||
              pl.id === 'LL' ||
              pl.id === 'LIKED_SONGS' ||
              pl.title.toLowerCase().includes('liked');

            return (
              <div
                key={pl.id}
                onClick={() => handleSelect(pl)}
                className={`group relative rounded-[22px] overflow-hidden ios-bubble-card p-3 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-spotify bg-spotify/10 ring-2 ring-spotify/40 shadow-lg shadow-emerald-950/40 -translate-y-0.5'
                    : isLikedMusic
                    ? 'border-pink-500/30 bg-pink-950/10 hover:border-pink-500/60'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 mb-2.5 flex items-center justify-center">
                  {isLikedMusic ? (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white fill-current animate-pulse" />
                    </div>
                  ) : (
                    <img
                      src={pl.thumbnailUrl}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Item count tag */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1 border border-white/10">
                    <Music className="w-3 h-3 text-spotify" />
                    <span>
                      {isLikedMusic
                        ? 'Auto Library'
                        : `${pl.itemCount} tracks`}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-0.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-spotify transition">
                    {pl.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {pl.ownerTitle || pl.channelTitle || 'Curated Playlist'}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-spotify/20 text-spotify flex items-center justify-between text-[11px] font-semibold">
                    <span>Selected for Transfer</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-spotify animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Playlist Customization Box */}
      {selectedPlaylist && (
        <div className="p-4 sm:p-5 rounded-[24px] ios-bubble-card space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            <Edit3 className="w-3.5 h-3.5 text-spotify" />
            <span>Target {targetName} Playlist Settings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                {targetName} Playlist Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={`Playlist name on ${targetName}`}
                className="w-full px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-spotify focus:ring-1 focus:ring-spotify"
              />
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${sourceConfig.bgColor} border ${sourceConfig.borderColor} ${sourceConfig.color}`}
              >
                {sourcePlatform === 'youtube'
                  ? 'YT'
                  : sourcePlatform === 'spotify'
                  ? 'SP'
                  : sourcePlatform === 'amazon'
                  ? 'AZ'
                  : 'JS'}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-semibold truncate text-xs">{selectedPlaylist.title}</p>
                <p className="truncate text-[10px]">
                  {selectedPlaylist.itemCount > 0 ? `${selectedPlaylist.itemCount} items • ` : ''}
                  {sourceName} ➔ {targetName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
        <button
          onClick={onBack}
          className="ios-btn flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={() => {
            if (selectedPlaylist) {
              onSelectAndStart(selectedPlaylist, customName);
            }
          }}
          disabled={!selectedPlaylist || isLoading}
          className={`ios-btn flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-extrabold text-xs sm:text-sm transition-all ${
            selectedPlaylist
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-lg shadow-emerald-950/50 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Start Real-time Migration</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

