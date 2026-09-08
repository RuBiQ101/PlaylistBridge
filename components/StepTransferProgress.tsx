'use client';

import React, { useRef, useEffect } from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  Search,
  Sparkles,
  Music2,
  Layers,
  Check,
} from 'lucide-react';
import { MigrationProgressEvent, PlatformId, TrackReconciliation } from '@/lib/types';

interface StepTransferProgressProps {
  progressEvents: MigrationProgressEvent[];
  latestEvent: MigrationProgressEvent | null;
  reconciliations: TrackReconciliation[];
  sourcePlatform?: PlatformId;
  targetPlatform?: PlatformId;
  isComplete: boolean;
  onViewSummary: () => void;
}

export const StepTransferProgress: React.FC<StepTransferProgressProps> = ({
  progressEvents,
  latestEvent,
  reconciliations,
  sourcePlatform = 'youtube',
  targetPlatform = 'spotify',
  isComplete,
  onViewSummary,
}) => {
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal to latest message
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [progressEvents]);

  const isSpotifyToYouTube = sourcePlatform === 'spotify' && targetPlatform === 'youtube';
  const sourceName = sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music';
  const targetName = targetPlatform === 'youtube' ? 'YouTube Music' : 'Spotify';

  const total = latestEvent?.totalTracks || 1;
  const current = latestEvent?.currentIndex || 0;
  const matched = latestEvent?.matchedCount || 0;
  const unmatched = latestEvent?.unmatchedCount || 0;
  const progressPercent = Math.min(100, Math.round((current / (total || 1)) * 100));

  const currentTrack = latestEvent?.currentTrack;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Loader2
              className={`w-4 h-4 animate-spin ${
                targetPlatform === 'youtube' ? 'text-red-500' : 'text-spotify'
              }`}
            />
          )}
          <span>
            {isComplete
              ? 'Migration Complete!'
              : `Step 3 of 4 • Streaming ${sourceName} ➔ ${targetName}`}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {isComplete
            ? `Playlist Transferred to ${targetName} Successfully`
            : `Transferring to ${targetName}...`}
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {isComplete
            ? `Your tracks have been matched, duration-verified, and added to your ${targetName} library.`
            : `Streaming track metadata, normalizing titles, querying ${targetName} catalog, and verifying durations (±12s).`}
        </p>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Tracks */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium mb-1">Total Tracks</p>
          <p className="text-2xl font-black text-white">{total}</p>
        </div>

        {/* Progress */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium mb-1">Progress</p>
          <p
            className={`text-2xl font-black ${
              targetPlatform === 'youtube' ? 'text-red-400' : 'text-spotify'
            }`}
          >
            {progressPercent}%
          </p>
        </div>

        {/* Matched */}
        <div className="p-4 rounded-2xl glass-panel border border-emerald-900/30 text-center">
          <p className="text-xs text-emerald-400 font-medium mb-1">Matched</p>
          <p className="text-2xl font-black text-emerald-400">{matched}</p>
        </div>

        {/* Unmatched */}
        <div className="p-4 rounded-2xl glass-panel border border-amber-900/30 text-center">
          <p className="text-xs text-amber-400 font-medium mb-1">Unmatched</p>
          <p className="text-2xl font-black text-amber-400">{unmatched}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 p-6 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-2">
            {!isComplete && (
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  targetPlatform === 'youtube' ? 'bg-red-500' : 'bg-spotify'
                }`}
              />
            )}
            <span>{latestEvent?.message || 'Processing migration...'}</span>
          </span>
          <span
            className={`font-mono ${
              targetPlatform === 'youtube' ? 'text-red-400' : 'text-spotify'
            }`}
          >
            {current}/{total} tracks ({progressPercent}%)
          </span>
        </div>

        {/* Bar */}
        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out shadow-lg ${
              targetPlatform === 'youtube'
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-red-500/50'
                : 'bg-gradient-to-r from-emerald-500 via-spotify to-spotify-accent shadow-emerald-500/50'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Track Reconciliation Card */}
      {currentTrack && !isComplete && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-spotify" />
              <span>Normalization & Verification Engine</span>
            </span>
            <span className="text-slate-500">Track #{currentTrack.index}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Source */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  sourcePlatform === 'spotify' ? 'text-spotify' : 'text-red-400'
                }`}
              >
                Source ({sourceName})
              </span>
              <p className="font-semibold text-white line-clamp-1">
                {currentTrack.sourceTrack.title}
              </p>
              <p className="text-slate-400 text-[11px]">
                Cleaned:{' '}
                <span className="text-slate-200 font-mono font-medium">
                  "{currentTrack.cleaned.cleanedTitle}"
                </span>{' '}
                by{' '}
                <span className="text-slate-200 font-mono font-medium">
                  "{currentTrack.cleaned.cleanedArtist}"
                </span>
              </p>
            </div>

            {/* Destination Match */}
            <div
              className={`p-3 rounded-xl border space-y-1 ${
                currentTrack.status === 'MATCHED'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  currentTrack.status === 'MATCHED' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {currentTrack.status === 'MATCHED'
                  ? `${targetName} Candidate (Verified)`
                  : 'Status'}
              </span>
              {currentTrack.status === 'MATCHED' ? (
                <div>
                  <p className="font-semibold text-white line-clamp-1">
                    {currentTrack.targetTrackTitle ||
                      currentTrack.spotifyTrack?.name ||
                      currentTrack.youtubeTrack?.name}{' '}
                    •{' '}
                    {currentTrack.targetTrackArtist ||
                      currentTrack.spotifyTrack?.artist ||
                      currentTrack.youtubeTrack?.artist}
                  </p>
                  <p className="text-emerald-400/90 text-[11px]">
                    ✓ Duration match (diff:{' '}
                    {currentTrack.targetDurationDiffSec ??
                      currentTrack.spotifyTrack?.durationDiffSec ??
                      0}
                    s)
                  </p>
                </div>
              ) : (
                <p className="text-amber-300 font-medium text-[11px]">
                  {currentTrack.reason || `Searching ${targetName} catalog...`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terminal Style Live Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-400 ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span>live_migration_stream.log</span>
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {progressEvents.length} events logged
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
          {progressEvents.map((evt, idx) => {
            let badgeClass = 'text-slate-400';
            let tag = 'INFO';

            if (evt.type === 'TRACK_MATCHED') {
              badgeClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
              tag = 'MATCH';
            } else if (evt.type === 'TRACK_UNMATCHED') {
              badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              tag = 'MISS';
            } else if (evt.type === 'COMPLETE') {
              badgeClass = 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40 font-bold';
              tag = 'DONE';
            } else if (evt.type === 'ERROR') {
              badgeClass = 'text-red-400 bg-red-500/10 border-red-500/20';
              tag = 'ERROR';
            } else if (
              evt.type === 'CREATING_TARGET_PLAYLIST' ||
              evt.type === 'CREATING_SPOTIFY_PLAYLIST' ||
              evt.type === 'ADDING_TRACKS'
            ) {
              badgeClass = 'text-sky-400 bg-sky-500/10 border-sky-500/20';
              tag = 'API';
            }

            return (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed text-slate-300">
                <span className="text-slate-600 select-none">
                  {new Date().toLocaleTimeString()}
                </span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] uppercase font-bold rounded border shrink-0 ${badgeClass}`}
                >
                  {tag}
                </span>
                <span className="break-all">{evt.message}</span>
              </div>
            );
          })}
          <div ref={terminalBottomRef} />
        </div>
      </div>

      {/* Completion Action */}
      {isComplete && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Migration Completed!</h3>
              <p className="text-xs text-slate-300">
                Matched {matched} of {total} tracks ({Math.round((matched / total) * 100)}% match
                rate).
              </p>
            </div>
          </div>

          <button
            onClick={onViewSummary}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg scale-100 hover:scale-[1.02] cursor-pointer ${
              targetPlatform === 'youtube'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                : 'bg-spotify hover:bg-spotify-accent text-black shadow-emerald-950/50'
            }`}
          >
            View Summary & {targetName} Playlist
          </button>
        </div>
      )}
    </div>
  );
};
