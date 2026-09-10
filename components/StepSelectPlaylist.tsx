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
  Sparkles,
} from 'lucide-react';
import { GenericPlaylist, PlatformId, GeneratedTastePlaylist } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';
import { TasteAnalyserModal } from './TasteAnalyserModal';

interface StepSelectPlaylistProps {
  sourcePlatform?: PlatformId;
  targetPlatform?: PlatformId;
  onBack: () => void;
  onSelectAndStart: (playlist: GenericPlaylist, customName: string) => void;
}

export const StepSelectPlaylist: React.FC<StepSelectPlaylistProps> = ({
  sourcePlatform = 'youtube',
  targetPlatform = 'spotify',
  onBack,
  onSelectAndStart,
}) => {
  const [playlists, setPlaylists] = useState<GenericPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<GenericPlaylist | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Taste Intelligence Modal State
  const [isTasteModalOpen, setIsTasteModalOpen] = useState<boolean>(false);

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

  const handleSelectGeneratedPlaylist = (genPl: GeneratedTastePlaylist) => {
    setPlaylists((prev) => {
      const exists = prev.some((p) => p.id === genPl.id);
      return exists ? prev : [genPl, ...prev];
    });
    setSelectedPlaylist(genPl);
    setCustomName(genPl.title);
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium mb-2">
            <ListMusic className={`w-4 h-4 ${sourceConfig.color}`} />
            <span>Step 2 of 4 • Select Source Playlist</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Choose a {sourceName} Playlist
          </h1>
          <p className="text-slate-400 text-sm">
            Select from your {sourceName} library or paste any playlist link to transfer to{' '}
            {targetName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTasteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white text-xs font-black shadow-lg shadow-indigo-950/60 transition-all cursor-pointer scale-100 hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Analyze Taste & Smart Mix</span>
          </button>

          <button
            onClick={fetchPlaylists}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Paste Playlist URL Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900/80 to-slate-950/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Link className={`w-3.5 h-3.5 ${sourceConfig.color}`} />
          <span>Import Any {sourceName} Link or ID</span>
        </div>
        <form onSubmit={handleImportByUrl} className="flex gap-2">
          <input
            type="text"
            placeholder={
              sourcePlatform === 'jiosaavn'
                ? 'Paste JioSaavn playlist/album link (e.g., https://www.jiosaavn.com/featured/...)'
                : sourcePlatform === 'spotify'
                ? 'Paste Spotify playlist URL or URI (e.g., https://open.spotify.com/playlist/...)'
                : sourcePlatform === 'amazon'
                ? 'Paste Amazon Music playlist URL (e.g., https://music.amazon.com/playlists/...)'
                : 'Paste YouTube Music playlist link or ID (e.g., https://music.youtube.com/playlist?list=...)'
            }
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isImportingUrl || !urlInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            {isImportingUrl ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Import</span>
          </button>
        </form>
        {importError && <p className="text-xs text-red-400">{importError}</p>}
      </div>

      {/* Search and Filters */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={`Filter ${sourceName} playlists by title...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-spotify/60 focus:ring-1 focus:ring-spotify/60 transition"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchPlaylists}
            className="px-3 py-1 bg-red-900/50 hover:bg-red-800/50 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Playlist Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-4 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-video rounded-xl bg-slate-800" />
              <div className="h-5 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredPlaylists.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
          <Music className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-semibold">No playlists found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try importing via link above or refresh your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaylists.map((pl) => {
            const isSelected = selectedPlaylist?.id === pl.id;
            const isTasteMix = pl.id.startsWith('taste-') || pl.title.includes('[Taste Mix]');
            const isLikedMusic =
              pl.id === 'LM' ||
              pl.id === 'LL' ||
              pl.id === 'LIKED_SONGS' ||
              pl.title.toLowerCase().includes('liked');

            return (
              <div
                key={pl.id}
                onClick={() => handleSelect(pl)}
                className={`group relative rounded-2xl overflow-hidden glass-panel p-4 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? isTasteMix
                      ? 'border-indigo-400 bg-indigo-500/10 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-950/60 -translate-y-1'
                      : 'border-spotify bg-spotify/5 ring-2 ring-spotify/40 shadow-lg shadow-emerald-950/40 -translate-y-1'
                    : isTasteMix
                    ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400 hover:-translate-y-0.5'
                    : isLikedMusic
                    ? 'border-pink-500/30 bg-pink-950/10 hover:border-pink-500/60 hover:-translate-y-0.5'
                    : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50 hover:-translate-y-0.5'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3.5 flex items-center justify-center">
                  {isTasteMix ? (
                    <div className="w-full h-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-3 text-center">
                      <Sparkles className="w-7 h-7 text-white animate-bounce mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/40 px-2 py-0.5 rounded-full">
                        AI Taste Mix
                      </span>
                    </div>
                  ) : isLikedMusic ? (
                    <div className="w-full h-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-white fill-current animate-pulse" />
                    </div>
                  ) : (
                    <img
                      src={pl.thumbnailUrl}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Item count tag */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                    <Music className="w-3.5 h-3.5 text-spotify" />
                    <span>
                      {isTasteMix
                        ? `${pl.itemCount} Multi-Style Tracks`
                        : isLikedMusic
                        ? 'Auto Library'
                        : `${pl.itemCount} tracks`}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-spotify transition">
                      {pl.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {isTasteMix
                      ? 'AI Curated • Multi-Genre Sound Capsule'
                      : pl.ownerTitle || pl.channelTitle || 'Curated Playlist'}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div
                    className={`mt-3.5 pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                      isTasteMix ? 'border-indigo-500/30 text-indigo-300' : 'border-spotify/20 text-spotify'
                    }`}
                  >
                    <span>Selected for Transfer</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isTasteMix ? 'bg-indigo-400' : 'bg-spotify'
                      } animate-ping`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Playlist Customization Box */}
      {selectedPlaylist && (
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Edit3 className="w-4 h-4 text-spotify" />
            <span>Target {targetName} Playlist Settings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1.5">
                {targetName} Playlist Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={`Playlist name on ${targetName}`}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-spotify focus:ring-1 focus:ring-spotify"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${sourceConfig.bgColor} border ${sourceConfig.borderColor} ${sourceConfig.color}`}
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
                <p className="text-white font-semibold truncate">{selectedPlaylist.title}</p>
                <p className="truncate text-[11px]">
                  {selectedPlaylist.itemCount > 0 ? `${selectedPlaylist.itemCount} items • ` : ''}
                  {sourceName} ➔ {targetName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Route Selection</span>
        </button>

        <button
          onClick={() => {
            if (selectedPlaylist) {
              onSelectAndStart(selectedPlaylist, customName);
            }
          }}
          disabled={!selectedPlaylist || isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            selectedPlaylist
              ? 'bg-gradient-to-r from-emerald-500 to-spotify hover:from-emerald-400 hover:to-spotify-accent text-black shadow-lg shadow-emerald-950/50 cursor-pointer scale-100 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Start Real-time Migration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Music Taste Intelligence & Smart Mix Modal */}
      <TasteAnalyserModal
        isOpen={isTasteModalOpen}
        onClose={() => setIsTasteModalOpen(false)}
        sourcePlatform={sourcePlatform}
        targetPlatform={targetPlatform}
        onSelectGeneratedPlaylist={handleSelectGeneratedPlaylist}
      />
    </div>
  );
};

