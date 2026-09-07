'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Download,
  RotateCcw,
  Search,
  Filter,
  Music,
  Check,
  X,
  Sparkles,
  Share2,
} from 'lucide-react';
import { TrackReconciliation, YouTubePlaylist } from '@/lib/types';

interface StepSummaryProps {
  sourcePlaylist: YouTubePlaylist | null;
  spotifyPlaylistUrl?: string;
  spotifyPlaylistName?: string;
  reconciliations: TrackReconciliation[];
  onMigrateAnother: () => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  sourcePlaylist,
  spotifyPlaylistUrl,
  spotifyPlaylistName,
  reconciliations,
  onMigrateAnother,
}) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const total = reconciliations.length;
  const matched = reconciliations.filter((r) => r.status === 'MATCHED').length;
  const unmatched = reconciliations.filter((r) => r.status === 'UNMATCHED').length;
  const matchRate = total > 0 ? Math.round((matched / total) * 100) : 100;

  const filtered = reconciliations.filter((item) => {
    if (filter === 'matched' && item.status !== 'MATCHED') return false;
    if (filter === 'unmatched' && item.status !== 'UNMATCHED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSource = item.sourceTrack.title.toLowerCase().includes(q);
      const matchClean = item.cleaned.cleanedTitle.toLowerCase().includes(q) || item.cleaned.cleanedArtist.toLowerCase().includes(q);
      const matchSpotify = item.spotifyTrack?.name.toLowerCase().includes(q) || item.spotifyTrack?.artist.toLowerCase().includes(q);
      return matchSource || matchClean || matchSpotify;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['#', 'Original YouTube Title', 'Cleaned Title', 'Cleaned Artist', 'Status', 'Spotify Track', 'Spotify Artist', 'Duration Diff (s)', 'Spotify URL', 'Unmatched Reason'];
    const rows = reconciliations.map((r) => [
      r.index,
      `"${r.sourceTrack.title.replace(/"/g, '""')}"`,
      `"${r.cleaned.cleanedTitle.replace(/"/g, '""')}"`,
      `"${r.cleaned.cleanedArtist.replace(/"/g, '""')}"`,
      r.status,
      r.spotifyTrack ? `"${r.spotifyTrack.name.replace(/"/g, '""')}"` : '',
      r.spotifyTrack ? `"${r.spotifyTrack.artist.replace(/"/g, '""')}"` : '',
      r.spotifyTrack?.durationDiffSec ?? '',
      r.spotifyTrack?.spotifyUrl || '',
      r.reason ? `"${r.reason.replace(/"/g, '""')}"` : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `playlist-migration-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Step 4 of 4 • Migration Summary</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Transfer Complete!
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Successfully migrated playlist{' '}
          <span className="text-white font-medium">"{sourcePlaylist?.title}"</span> to Spotify.
        </p>
      </div>

      {/* Main Stats Card with Big Spotify Action Button */}
      <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/40 to-slate-900/60 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-lg bg-spotify/20 text-spotify text-xs font-bold uppercase tracking-wider border border-spotify/30">
                {matchRate}% Match Rate
              </span>
              <span className="text-xs text-slate-400">
                • {matched} matched / {unmatched} unmatched
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {spotifyPlaylistName || `[Migrated] ${sourcePlaylist?.title}`}
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Playlist is now available in your Spotify Library ready to play, shuffle, and share.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {spotifyPlaylistUrl && (
              <a
                href={spotifyPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-spotify hover:bg-spotify-accent text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-950/60 scale-100 hover:scale-[1.03] group"
              >
                <span>Open in Spotify</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}

            <button
              onClick={exportCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Track Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tracks ({total})
            </button>
            <button
              onClick={() => setFilter('matched')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filter === 'matched'
                  ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Matched ({matched})</span>
            </button>
            <button
              onClick={() => setFilter('unmatched')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                filter === 'unmatched'
                  ? 'bg-amber-500/20 text-amber-400 shadow-sm border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Unmatched ({unmatched})</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-spotify"
            />
          </div>
        </div>

        {/* Tracks Table Container */}
        <div className="rounded-2xl border border-slate-800 glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Original YouTube Track</th>
                  <th className="py-3 px-4">Cleaned Query</th>
                  <th className="py-3 px-4">Spotify Result</th>
                  <th className="py-3 px-4">Status & Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => {
                  const isMatched = item.status === 'MATCHED';
                  return (
                    <tr
                      key={item.index}
                      className="hover:bg-slate-900/40 transition duration-150"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500">{item.index}</td>
                      
                      {/* Original YT Track */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-white line-clamp-1">
                          {item.sourceTrack.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.sourceTrack.channelTitle}
                          {item.sourceTrack.durationSec ? ` • ${Math.floor(item.sourceTrack.durationSec / 60)}:${(item.sourceTrack.durationSec % 60).toString().padStart(2, '0')}` : ''}
                        </p>
                      </td>

                      {/* Cleaned Query */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                        <span className="text-slate-100 font-semibold">"{item.cleaned.cleanedTitle}"</span>
                        <br />
                        <span className="text-slate-400">by {item.cleaned.cleanedArtist}</span>
                      </td>

                      {/* Spotify Result */}
                      <td className="py-3.5 px-4">
                        {isMatched && item.spotifyTrack ? (
                          <div className="flex items-center gap-2">
                            {item.spotifyTrack.albumImageUrl && (
                              <img
                                src={item.spotifyTrack.albumImageUrl}
                                alt="Album"
                                className="w-8 h-8 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <a
                                href={item.spotifyTrack.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-spotify hover:underline line-clamp-1 flex items-center gap-1"
                              >
                                <span>{item.spotifyTrack.name}</span>
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {item.spotifyTrack.artist} (diff: {item.spotifyTrack.durationDiffSec ?? 0}s)
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">No match</span>
                        )}
                      </td>

                      {/* Status / Reason */}
                      <td className="py-3.5 px-4">
                        {isMatched ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            <span>Matched</span>
                          </span>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-[11px] border border-amber-500/20 mb-1">
                              <X className="w-3 h-3" />
                              <span>Unmatched</span>
                            </span>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {item.reason || 'Search tolerance exceeded'}
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={onMigrateAnother}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition border border-slate-800"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Migrate Another Playlist</span>
        </button>

        {spotifyPlaylistUrl && (
          <a
            href={spotifyPlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-spotify hover:bg-spotify-accent text-black font-extrabold text-xs transition"
          >
            <span>Launch Spotify App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
