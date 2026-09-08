import { NextRequest } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import {
  PLATFORMS_CONFIG,
  fetchPlatformPlaylists,
  fetchPlatformPlaylistTracks,
  searchPlatformTrack,
  createPlatformPlaylist,
  addTracksToPlatformPlaylist,
} from '@/lib/platforms';
import { cleanTrackMetadata } from '@/lib/normalization';
import { refreshSpotifyAccessToken } from '@/lib/spotify';
import {
  MigrationProgressEvent,
  PlatformId,
  TrackReconciliation,
  GenericTrack,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('playlistId');
  const customName = searchParams.get('customName');
  const sourcePlatform = (searchParams.get('sourcePlatform') || 'youtube') as PlatformId;
  const targetPlatform = (searchParams.get('targetPlatform') || 'spotify') as PlatformId;

  if (!playlistId) {
    return new Response(JSON.stringify({ error: 'Missing playlistId parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await getSession();
  const isDemo =
    session.isDemoMode ||
    (!session[sourcePlatform]?.accessToken && !session[targetPlatform]?.accessToken);

  // Auto-refresh Spotify token if Spotify is involved and token is near expiry
  let spotifyAccessToken = session.spotify?.accessToken || 'demo_token';
  if (
    (sourcePlatform === 'spotify' || targetPlatform === 'spotify') &&
    !isDemo &&
    session.spotify?.refreshToken &&
    session.spotify.expiresAt
  ) {
    if (Date.now() > session.spotify.expiresAt - 60000) {
      try {
        const refreshed = await refreshSpotifyAccessToken(session.spotify.refreshToken);
        spotifyAccessToken = refreshed.accessToken;
        session.spotify.accessToken = refreshed.accessToken;
        session.spotify.expiresAt = Date.now() + refreshed.expiresIn * 1000;
        if (refreshed.refreshToken) {
          session.spotify.refreshToken = refreshed.refreshToken;
        }
        await saveSession(session);
      } catch (e: any) {
        console.warn('Could not auto-refresh Spotify token:', e.message);
      }
    }
  }

  const sourceConfig = PLATFORMS_CONFIG[sourcePlatform] || PLATFORMS_CONFIG.youtube;
  const targetConfig = PLATFORMS_CONFIG[targetPlatform] || PLATFORMS_CONFIG.spotify;

  const sourceAccessToken = session[sourcePlatform]?.accessToken || 'demo_token';
  const targetAccessToken = session[targetPlatform]?.accessToken || 'demo_token';

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Helper to push SSE JSON events
  const sendEvent = async (event: MigrationProgressEvent) => {
    try {
      const payload = `data: ${JSON.stringify(event)}\n\n`;
      await writer.write(encoder.encode(payload));
    } catch (e) {
      // client may have closed connection
    }
  };

  // Run the universal asynchronous migration pipeline
  (async () => {
    const startTime = Date.now();

    try {
      // 1. Initialize Transfer
      await sendEvent({
        type: 'INIT',
        playlistId,
        sourcePlatform,
        targetPlatform,
        totalTracks: 0,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: `Initializing transfer pipeline (${sourceConfig.name} ➔ ${targetConfig.name})...`,
        logLevel: 'info',
      });

      // 2. Fetch Source Playlist Info & Tracks
      await sendEvent({
        type: 'FETCHING_SOURCE',
        playlistId,
        sourcePlatform,
        targetPlatform,
        totalTracks: 0,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: `Fetching ${sourceConfig.name} playlist tracks and audio metadata...`,
        logLevel: 'info',
      });

      const allPlaylists = await fetchPlatformPlaylists(
        sourcePlatform,
        sourceAccessToken,
        isDemo
      );
      const matchedPl = allPlaylists.find((p) => p.id === playlistId);
      const sourcePlaylistTitle =
        matchedPl?.title || customName || `Imported ${sourceConfig.name} Playlist`;

      const tracks: GenericTrack[] = await fetchPlatformPlaylistTracks(
        sourcePlatform,
        sourceAccessToken,
        playlistId,
        isDemo
      );

      const totalTracks = tracks.length;
      let matchedCount = 0;
      let unmatchedCount = 0;
      const matchedTargetIdsOrUris: string[] = [];
      const reconciliations: TrackReconciliation[] = [];

      await sendEvent({
        type: 'FETCHING_SOURCE',
        playlistId,
        playlistTitle: sourcePlaylistTitle,
        sourcePlatform,
        targetPlatform,
        totalTracks,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: `Found ${totalTracks} tracks in "${sourcePlaylistTitle}". Starting audio normalization and catalog matching...`,
        logLevel: 'info',
      });

      // 3. Process Each Track
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const index = i + 1;

        // Clean & Normalize Track Metadata
        const rawArtist = track.artist || track.channelTitle || '';
        const cleaned = cleanTrackMetadata(
          track.title,
          rawArtist,
          track.durationSec
        );

        // Notify client: Searching
        await sendEvent({
          type: 'TRACK_SEARCHING',
          playlistId,
          playlistTitle: sourcePlaylistTitle,
          sourcePlatform,
          targetPlatform,
          totalTracks,
          currentIndex: index,
          matchedCount,
          unmatchedCount,
          message: `[${index}/${totalTracks}] Normalizing: "${cleaned.cleanedTitle}" by "${cleaned.cleanedArtist}"...`,
          logLevel: 'info',
        });

        // Realistic delay in demo mode for visualization
        if (isDemo) {
          await new Promise((resolve) => setTimeout(resolve, 280));
        }

        // Search track on target platform
        const searchResult = await searchPlatformTrack(
          targetPlatform,
          targetAccessToken,
          cleaned.cleanedTitle,
          cleaned.cleanedArtist,
          track.durationSec,
          isDemo
        );

        if (searchResult.track) {
          matchedCount++;
          matchedTargetIdsOrUris.push(searchResult.track.uri || searchResult.track.id);

          const recon: TrackReconciliation = {
            index,
            sourceTrack: track,
            cleaned,
            status: 'MATCHED',
            targetTrackTitle: searchResult.track.name,
            targetTrackArtist: searchResult.track.artist,
            targetTrackUrl: searchResult.track.url,
            targetDurationDiffSec: searchResult.track.durationDiffSec,
            timestamp: new Date().toLocaleTimeString(),
          };
          reconciliations.push(recon);

          await sendEvent({
            type: 'TRACK_MATCHED',
            playlistId,
            playlistTitle: sourcePlaylistTitle,
            sourcePlatform,
            targetPlatform,
            totalTracks,
            currentIndex: index,
            matchedCount,
            unmatchedCount,
            currentTrack: recon,
            message: `✓ Matched: "${cleaned.cleanedTitle}" ➔ ${targetConfig.name}: "${searchResult.track.name}" (${searchResult.track.artist})`,
            logLevel: 'success',
          });
        } else {
          unmatchedCount++;
          const recon: TrackReconciliation = {
            index,
            sourceTrack: track,
            cleaned,
            status: 'UNMATCHED',
            reason:
              searchResult.reason ||
              `No matching track found on ${targetConfig.name} within duration tolerance`,
            timestamp: new Date().toLocaleTimeString(),
          };
          reconciliations.push(recon);

          await sendEvent({
            type: 'TRACK_UNMATCHED',
            playlistId,
            playlistTitle: sourcePlaylistTitle,
            sourcePlatform,
            targetPlatform,
            totalTracks,
            currentIndex: index,
            matchedCount,
            unmatchedCount,
            currentTrack: recon,
            message: `✗ Unmatched: "${track.title}" (${searchResult.reason || 'Not found'})`,
            logLevel: 'warn',
          });
        }
      }

      // 4. Create Target Playlist on Target Platform
      const targetPlaylistName = customName || `[Migrated] ${sourcePlaylistTitle}`;

      await sendEvent({
        type: 'CREATING_TARGET_PLAYLIST',
        playlistId,
        playlistTitle: sourcePlaylistTitle,
        sourcePlatform,
        targetPlatform,
        totalTracks,
        currentIndex: totalTracks,
        matchedCount,
        unmatchedCount,
        message: `Creating ${targetConfig.name} playlist "${targetPlaylistName}"...`,
        logLevel: 'info',
      });

      const targetPlaylistResult = await createPlatformPlaylist(
        targetPlatform,
        targetAccessToken,
        session[targetPlatform]?.userId || 'demo_user',
        targetPlaylistName,
        `Migrated from ${sourceConfig.name} playlist "${sourcePlaylistTitle}" with PlaylistBridge on ${new Date().toLocaleDateString()}`,
        isDemo
      );

      // 5. Batch Add Tracks to Target Playlist
      if (matchedTargetIdsOrUris.length > 0) {
        await sendEvent({
          type: 'ADDING_TRACKS',
          playlistId,
          playlistTitle: sourcePlaylistTitle,
          sourcePlatform,
          targetPlatform,
          totalTracks,
          currentIndex: totalTracks,
          matchedCount,
          unmatchedCount,
          targetPlaylistId: targetPlaylistResult.id,
          targetPlaylistUrl: targetPlaylistResult.url,
          spotifyPlaylistId: targetPlaylistResult.id,
          spotifyPlaylistUrl: targetPlaylistResult.url,
          message: `Adding ${matchedTargetIdsOrUris.length} tracks to ${targetConfig.name} playlist...`,
          logLevel: 'info',
        });

        await addTracksToPlatformPlaylist(
          targetPlatform,
          targetAccessToken,
          targetPlaylistResult.id,
          matchedTargetIdsOrUris,
          isDemo
        );
      }

      // 6. Complete
      const elapsedMs = Date.now() - startTime;
      await sendEvent({
        type: 'COMPLETE',
        playlistId,
        playlistTitle: sourcePlaylistTitle,
        sourcePlatform,
        targetPlatform,
        totalTracks,
        currentIndex: totalTracks,
        matchedCount,
        unmatchedCount,
        targetPlaylistId: targetPlaylistResult.id,
        targetPlaylistUrl: targetPlaylistResult.url,
        spotifyPlaylistId: targetPlaylistResult.id,
        spotifyPlaylistUrl: targetPlaylistResult.url,
        message: `Migration completed in ${(elapsedMs / 1000).toFixed(1)}s! Successfully created ${targetConfig.name} playlist with ${matchedCount} matched tracks.`,
        logLevel: 'success',
      });
    } catch (err: any) {
      console.error('Migration SSE stream failed:', err);
      await sendEvent({
        type: 'ERROR',
        playlistId,
        sourcePlatform,
        targetPlatform,
        totalTracks: 0,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: `Migration notice: ${err.message || 'Error encountered during transfer'}.`,
        logLevel: 'error',
      });
    } finally {
      writer.close().catch(() => {});
    }
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
