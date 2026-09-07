'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Music,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ListMusic,
  Edit3,
  Link,
  Heart,
  Plus,
  Loader2,
} from 'lucide-react';
import { YouTubePlaylist } from '@/lib/types';

interface StepSelectPlaylistProps {
  onBack: () => void;
  onSelectAndStart: (playlist: YouTubePlaylist, customName: string) => void;
}

export const StepSelectPlaylist: React.FC<StepSelectPlaylistProps> = ({
  onBack,
  onSelectAndStart,
}) => {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<YouTubePlaylist | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Direct URL Import State
  const [urlInput, setUrlInput] = useState<string>('');
  const [isImportingUrl, setIsImportingUrl] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/playlists/youtube');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load playlists');
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
  }, []);

  const handleSelect = (playlist: YouTubePlaylist) => {
    setSelectedPlaylist(playlist);
    setCustomName(`[Migrated] ${playlist.title}`);
  };

  const handleImportByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsImportingUrl(true);
    setImportError(null);
    try {
      const res = await fetch('/api/playlists/youtube/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: urlInput.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Could not find YouTube playlist');
      }

      const data = await res.json();
      if (data.playlist) {
        // Prepend to playlists if not already in list
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
            <ListMusic className="w-4 h-4 text-youtube" />
            <span>Step 2 of 4 • Select Source Playlist</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Choose a YouTube Playlist
          </h1>
          <p className="text-slate-400 text-sm">
            Select from your library or paste any YouTube Music link (Recaps, Mixes, Liked Music).
          </p>
        </div>

        <button
          onClick={fetchPlaylists}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Playlists</span>
        </button>
      </div>

      {/* Paste Playlist / Mix / Recap URL Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900/80 to-slate-950/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Link className="w-3.5 h-3.5 text-spotify" />
          <span>Import Any YouTube Music Link, Mix, or Recap</span>
        </div>
        <form onSubmit={handleImportByUrl} className="flex gap-2">
          <input
            type="text"
            placeholder="Paste YouTube Music playlist link or ID (e.g., https://music.youtube.com/playlist?list=...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-spotify"
          />
          <button
            type="submit"
            disabled={isImportingUrl || !urlInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-spotify hover:bg-spotify-accent text-black font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
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
          placeholder="Filter playlists by title..."
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
            className="px-3 py-1 bg-red-900/50 hover:bg-red-800/50 rounded-lg text-xs font-semibold"
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
            const isLikedMusic = pl.id === 'LM' || pl.id === 'LL' || pl.title.toLowerCase().includes('liked');

            return (
              <div
                key={pl.id}
                onClick={() => handleSelect(pl)}
                className={`group relative rounded-2xl overflow-hidden glass-panel p-4 cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-spotify bg-spotify/5 ring-2 ring-spotify/40 shadow-lg shadow-emerald-950/40 -translate-y-1'
                    : isLikedMusic
                    ? 'border-pink-500/30 bg-pink-950/10 hover:border-pink-500/60 hover:-translate-y-0.5'
                    : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50 hover:-translate-y-0.5'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3.5 flex items-center justify-center">
                  {isLikedMusic ? (
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
                    <span>{isLikedMusic ? 'Auto Playlist' : `${pl.itemCount} tracks`}</span>
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
                    {pl.channelTitle || 'Curated Playlist'}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-3.5 pt-3 border-t border-spotify/20 flex items-center justify-between text-xs font-semibold text-spotify">
                    <span>Selected for Transfer</span>
                    <span className="w-2 h-2 rounded-full bg-spotify animate-ping" />
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
            <span>Target Spotify Playlist Settings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1.5">
                Spotify Playlist Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Playlist name on Spotify"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-spotify focus:ring-1 focus:ring-spotify"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold shrink-0">
                YT
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-semibold truncate">{selectedPlaylist.title}</p>
                <p className="truncate text-[11px]">
                  {selectedPlaylist.itemCount > 0 ? `${selectedPlaylist.itemCount} items • ` : ''}Will normalize titles & match duration (±12s)
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Connections</span>
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
    </div>
  );
};
