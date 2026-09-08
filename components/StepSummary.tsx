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
import { GenericPlaylist, PlatformId, TrackReconciliation } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

interface StepSummaryProps {
  sourcePlaylist: GenericPlaylist | null;
  targetPlaylistUrl?: string;
  targetPlaylistName?: string;
  sourcePlatform?: PlatformId;
  targetPlatform?: PlatformId;
  spotifyPlaylistUrl?: string;
  spotifyPlaylistName?: string;
  reconciliations: TrackReconciliation[];
  onMigrateAnother: () => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  sourcePlaylist,
  targetPlaylistUrl,
  targetPlaylistName,
  sourcePlatform = 'youtube',
  targetPlatform = 'spotify',
  spotifyPlaylistUrl,
  spotifyPlaylistName,
  reconciliations,
  onMigrateAnother,
}) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sourceConfig = PLATFORMS_CONFIG[sourcePlatform] || PLATFORMS_CONFIG.youtube;
  const targetConfig = PLATFORMS_CONFIG[targetPlatform] || PLATFORMS_CONFIG.spotify;
  const sourceName = sourceConfig.name;
  const targetName = targetConfig.name;

  const finalTargetUrl = targetPlaylistUrl || spotifyPlaylistUrl;
  const finalTargetName = targetPlaylistName || spotifyPlaylistName;

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
      const matchClean =
        item.cleaned.cleanedTitle.toLowerCase().includes(q) ||
        item.cleaned.cleanedArtist.toLowerCase().includes(q);
      const matchTarget =
        item.targetTrackTitle?.toLowerCase().includes(q) ||
        item.targetTrackArtist?.toLowerCase().includes(q) ||
        item.spotifyTrack?.name.toLowerCase().includes(q) ||
        item.spotifyTrack?.artist.toLowerCase().includes(q) ||
        item.youtubeTrack?.name.toLowerCase().includes(q);
      return matchSource || matchClean || matchTarget;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = [
      '#',
      `Original ${sourceName} Title`,
      'Cleaned Title',
      'Cleaned Artist',
      'Status',
      `Matched ${targetName} Track`,
      `Matched ${targetName} Artist`,
      'Duration Diff (s)',
      `${targetName} URL`,
      'Unmatched Reason',
    ];
    const rows = reconciliations.map((r) => {
      const targetTitle =
        r.targetTrackTitle || r.spotifyTrack?.name || r.youtubeTrack?.name || '';
      const targetArtist =
        r.targetTrackArtist || r.spotifyTrack?.artist || r.youtubeTrack?.artist || '';
      const targetUrl =
        r.targetTrackUrl || r.spotifyTrack?.spotifyUrl || r.youtubeTrack?.url || '';
      const durDiff =
        r.targetDurationDiffSec ??
        r.spotifyTrack?.durationDiffSec ??
        r.youtubeTrack?.durationDiffSec ??
        '';

      return [
        r.index,
        `"${r.sourceTrack.title.replace(/"/g, '""')}"`,
        `"${r.cleaned.cleanedTitle.replace(/"/g, '""')}"`,
        `"${r.cleaned.cleanedArtist.replace(/"/g, '""')}"`,
        r.status,
        `"${targetTitle.replace(/"/g, '""')}"`,
        `"${targetArtist.replace(/"/g, '""')}"`,
        durDiff,
        targetUrl,
        r.reason ? `"${r.reason.replace(/"/g, '""')}"` : '',
      ];
    });

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
          <span className="text-white font-medium">"{sourcePlaylist?.title}"</span> from{' '}
          {sourceName} to {targetName}.
        </p>
      </div>

      {/* Main Stats Card with Action Button */}
      <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/40 to-slate-900/60 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              New {targetName} Playlist Ready
            </span>
            <h2 className="text-2xl font-black text-white">
              {finalTargetName || sourcePlaylist?.title || 'Migrated Playlist'}
            </h2>
            <p className="text-xs text-slate-300">
              {matched} tracks transferred ({matchRate}% match accuracy) • Duration-verified (±12s)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {finalTargetUrl && (
              <a
                href={finalTargetUrl}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm transition-all shadow-xl scale-100 hover:scale-[1.03] cursor-pointer ${
                  targetPlatform === 'youtube'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60'
                    : targetPlatform === 'spotify'
                    ? 'bg-spotify hover:bg-spotify-accent text-black shadow-emerald-950/60'
                    : targetPlatform === 'amazon'
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-950/60'
                    : 'bg-teal-500 hover:bg-teal-400 text-white shadow-teal-950/60'
                }`}
              >
                <span>Open in {targetName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reconciled Tracks Table with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Tracks ({total})
            </button>
            <button
              onClick={() => setFilter('matched')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filter === 'matched'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-slate-900/80 text-emerald-400 border border-slate-800 hover:bg-emerald-950/30'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Matched ({matched})</span>
            </button>
            <button
              onClick={() => setFilter('unmatched')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filter === 'unmatched'
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-900/80 text-amber-400 border border-slate-800 hover:bg-amber-950/30'
              }`}
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
              <span>Unmatched ({unmatched})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audited tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-spotify"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Original {sourceName} Track</th>
                  <th className="py-3 px-4">Cleaned Query</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Matched {targetName} Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filtered.map((item) => {
                  const isMatched = item.status === 'MATCHED';
                  const targetTitle =
                    item.targetTrackTitle ||
                    item.spotifyTrack?.name ||
                    item.youtubeTrack?.name ||
                    '';
                  const targetArtist =
                    item.targetTrackArtist ||
                    item.spotifyTrack?.artist ||
                    item.youtubeTrack?.artist ||
                    '';
                  const targetUrl =
                    item.targetTrackUrl ||
                    item.spotifyTrack?.spotifyUrl ||
                    item.youtubeTrack?.url ||
                    '';
                  const durDiff =
                    item.targetDurationDiffSec ??
                    item.spotifyTrack?.durationDiffSec ??
                    item.youtubeTrack?.durationDiffSec ??
                    0;

                  return (
                    <tr key={item.index} className="hover:bg-slate-900/30 transition">
                      <td className="py-3 px-4 text-center text-slate-500 font-sans">
                        {item.index}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 font-sans font-medium text-white max-w-[220px]">
                        <p className="truncate" title={item.sourceTrack.title}>
                          {item.sourceTrack.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.sourceTrack.channelTitle || item.sourceTrack.artist || 'Source'}
                        </p>
                      </td>

                      {/* Cleaned */}
                      <td className="py-3 px-4 text-slate-300 max-w-[200px]">
                        <p className="truncate" title={item.cleaned.cleanedTitle}>
                          "{item.cleaned.cleanedTitle}"
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          by {item.cleaned.cleanedArtist}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isMatched
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          }`}
                        >
                          {isMatched ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Matched</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 stroke-[3]" />
                              <span>Unmatched</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="py-3 px-4 font-sans">
                        {isMatched ? (
                          <div className="flex items-center justify-between gap-2 max-w-[240px]">
                            <div className="overflow-hidden">
                              <p className="font-semibold text-white truncate">{targetTitle}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {targetArtist} • diff: {durDiff}s
                              </p>
                            </div>
                            {targetUrl && (
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-spotify p-1"
                                title={`Open on ${targetName}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-400/80 text-[11px] italic">
                            {item.reason || 'No candidate found'}
                          </span>
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

      {/* Footer Return Action */}
      <div className="pt-6 flex items-center justify-between border-t border-slate-800">
        <button
          onClick={onMigrateAnother}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Migrate Another Playlist</span>
        </button>
      </div>
    </div>
  );
};
