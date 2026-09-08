'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { PlatformSelector } from '@/components/PlatformSelector';
import { StepSelectPlaylist } from '@/components/StepSelectPlaylist';
import { StepTransferProgress } from '@/components/StepTransferProgress';
import { StepSummary } from '@/components/StepSummary';
import {
  PlatformAuthStatus,
  PlatformId,
  GenericPlaylist,
  MigrationProgressEvent,
  TrackReconciliation,
} from '@/lib/types';

type ViewMode = 'landing' | 'platforms' | 'playlists' | 'transfer' | 'summary';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [authStatus, setAuthStatus] = useState<PlatformAuthStatus | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Platform transfer direction
  const [sourcePlatform, setSourcePlatform] = useState<PlatformId>('youtube');
  const [targetPlatform, setTargetPlatform] = useState<PlatformId>('spotify');

  // Selected playlist & migration configuration
  const [selectedPlaylist, setSelectedPlaylist] = useState<GenericPlaylist | null>(null);
  const [customTargetName, setCustomTargetName] = useState<string>('');

  // Migration streaming state
  const [progressEvents, setProgressEvents] = useState<MigrationProgressEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<MigrationProgressEvent | null>(null);
  const [reconciliations, setReconciliations] = useState<TrackReconciliation[]>([]);
  const [isMigrationComplete, setIsMigrationComplete] = useState<boolean>(false);
  const [targetResultUrl, setTargetResultUrl] = useState<string | undefined>();
  const [targetResultId, setTargetResultId] = useState<string | undefined>();

  // Load Auth Status from API
  const fetchAuthStatus = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data: PlatformAuthStatus = await res.json();
        setAuthStatus(data);
      }
    } catch (e) {
      console.error('Failed to load auth status', e);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthStatus();
  }, [fetchAuthStatus]);

  // Handle URL params if returning from OAuth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('connected') || urlParams.get('auth_error')) {
        setViewMode('platforms');
      }
    }
  }, []);

  // Home Return Handler for Logo
  const handleGoHome = () => {
    setSelectedPlaylist(null);
    setCustomTargetName('');
    setProgressEvents([]);
    setReconciliations([]);
    setIsMigrationComplete(false);
    setTargetResultUrl(undefined);
    setTargetResultId(undefined);
    setViewMode('landing');
  };

  // Platform Logout
  const handlePlatformLogout = async (platform: string) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      await fetchAuthStatus();
    } catch (e) {
      console.error('Platform logout failed', e);
    }
  };

  // Proceed from Platform Direction Selector
  const handleProceedPlatforms = (source: PlatformId, target: PlatformId) => {
    setSourcePlatform(source);
    setTargetPlatform(target);
    setViewMode('playlists');
  };

  // Start Transfer via SSE Stream
  const handleStartTransfer = (playlist: GenericPlaylist, customName: string) => {
    setSelectedPlaylist(playlist);
    setCustomTargetName(customName);
    setProgressEvents([]);
    setReconciliations([]);
    setIsMigrationComplete(false);
    setTargetResultUrl(undefined);
    setViewMode('transfer');

    const eventSourceUrl = `/api/transfer/stream?playlistId=${encodeURIComponent(
      playlist.id
    )}&customName=${encodeURIComponent(customName)}&sourcePlatform=${encodeURIComponent(
      sourcePlatform
    )}&targetPlatform=${encodeURIComponent(targetPlatform)}`;

    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      try {
        const data: MigrationProgressEvent = JSON.parse(event.data);
        setLatestEvent(data);
        setProgressEvents((prev) => [...prev, data]);

        if (data.currentTrack) {
          setReconciliations((prev) => [...prev, data.currentTrack!]);
        }

        const url = data.targetPlaylistUrl || data.spotifyPlaylistUrl;
        const id = data.targetPlaylistId || data.spotifyPlaylistId;
        if (url) {
          setTargetResultUrl(url);
        }
        if (id) {
          setTargetResultId(id);
        }

        if (data.type === 'COMPLETE') {
          setIsMigrationComplete(true);
          eventSource.close();
        } else if (data.type === 'ERROR') {
          eventSource.close();
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();
    };
  };

  // Reset to Migrate Another Playlist
  const handleMigrateAnother = () => {
    setSelectedPlaylist(null);
    setCustomTargetName('');
    setProgressEvents([]);
    setReconciliations([]);
    setIsMigrationComplete(false);
    setViewMode('playlists');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Clean Navbar with Home Return */}
      <Navbar onGoHome={handleGoHome} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 1. Landing / Home Page */}
        {viewMode === 'landing' && (
          <LandingPage onGetStarted={() => setViewMode('platforms')} />
        )}

        {/* 2. Platform Selection & Connection Page */}
        {viewMode === 'platforms' && (
          <PlatformSelector
            authStatus={authStatus}
            isLoading={isAuthLoading}
            selectedSource={sourcePlatform}
            selectedTarget={targetPlatform}
            onProceed={handleProceedPlatforms}
            onBackToHome={() => setViewMode('landing')}
            onLogout={handlePlatformLogout}
          />
        )}

        {/* 3. Playlist Selection Page */}
        {viewMode === 'playlists' && (
          <StepSelectPlaylist
            sourcePlatform={sourcePlatform}
            targetPlatform={targetPlatform}
            onBack={() => setViewMode('platforms')}
            onSelectAndStart={handleStartTransfer}
          />
        )}

        {/* 4. Live Transfer Streaming Progress Page */}
        {viewMode === 'transfer' && (
          <StepTransferProgress
            progressEvents={progressEvents}
            latestEvent={latestEvent}
            reconciliations={reconciliations}
            sourcePlatform={sourcePlatform}
            targetPlatform={targetPlatform}
            isComplete={isMigrationComplete}
            onViewSummary={() => setViewMode('summary')}
          />
        )}

        {/* 5. Transfer Summary Page */}
        {viewMode === 'summary' && (
          <StepSummary
            sourcePlaylist={selectedPlaylist}
            targetPlaylistUrl={targetResultUrl}
            targetPlaylistName={customTargetName}
            sourcePlatform={sourcePlatform}
            targetPlatform={targetPlatform}
            reconciliations={reconciliations}
            onMigrateAnother={handleMigrateAnother}
          />
        )}
      </main>

      {/* Footer with Copyright */}
      <footer className="border-t border-slate-900/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">PlaylistBridge</span>
            <span>•</span>
            <span>© 2026 RuBiQ. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Spotify Web API</span>
            <span>•</span>
            <span>YouTube Data API v3</span>
            <span>•</span>
            <span>Duration Filter (±12s)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
