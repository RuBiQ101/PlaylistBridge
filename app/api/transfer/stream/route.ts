import { NextRequest } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import {
  fetchPlaylistTracks as fetchYouTubePlaylistTracks,
  fetchUserPlaylists as fetchYouTubeUserPlaylists,
  createYouTubePlaylist,
  searchYouTubeTrack,
  addTracksToYouTubePlaylist,
} from '@/lib/youtube';
import { cleanTrackMetadata } from '@/lib/normalization';
import {
  fetchSpotifyPlaylistTracks,
  fetchUserSpotifyPlaylists,
  searchSpotifyTrack,
  createSpotifyPlaylist,
  addTracksToSpotifyPlaylist,
  refreshSpotifyAccessToken,
} from '@/lib/spotify';
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
  const isDemo = session.isDemoMode || (!session.spotify?.accessToken && !session.youtube?.accessToken);

  // Auto-refresh Spotify token if expired or close to expiry (within 60s)
  let spotifyAccessToken = session.spotify?.accessToken || 'demo_token';
  if (!isDemo && session.spotify?.refreshToken && session.spotify.expiresAt) {
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

  const youtubeAccessToken = session.youtube?.accessToken || 'demo_token';

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

  // Run the asynchronous migration pipeline
  (async () => {
    const startTime = Date.now();
    const isSpotifyToYouTube = sourcePlatform === 'spotify' && targetPlatform === 'youtube';

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
        message: `Initializing transfer pipeline (${sourcePlatform === 'spotify' ? 'Spotify ➔ YouTube Music' : 'YouTube Music ➔ Spotify'})...`,
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
        message: `Fetching ${sourcePlatform === 'spotify' ? 'Spotify' : 'YouTube Music'} playlist tracks and metadata...`,
        logLevel: 'info',
      });

      let sourcePlaylistTitle = customName || 'Imported Playlist';
      let tracks: GenericTrack[] = [];

      if (isSpotifyToYouTube) {
        const spPlaylists = await fetchUserSpotifyPlaylists(spotifyAccessToken, isDemo);
        const matchedPl = spPlaylists.find((p) => p.id === playlistId);
        if (matchedPl) sourcePlaylistTitle = matchedPl.title;

        tracks = await fetchSpotifyPlaylistTracks(spotifyAccessToken, playlistId, isDemo);
      } else {
        const ytPlaylists = await fetchYouTubeUserPlaylists(youtubeAccessToken, isDemo);
        const matchedPl = ytPlaylists.find((p) => p.id === playlistId);
        if (matchedPl) sourcePlaylistTitle = matchedPl.title;

        tracks = await fetchYouTubePlaylistTracks(youtubeAccessToken, playlistId, isDemo);
      }

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
        message: `Found ${totalTracks} tracks in "${sourcePlaylistTitle}". Starting audio normalization and duration matching engine...`,
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

        // Delay in demo mode for realistic visual feedback
        if (isDemo) {
          await new Promise((resolve) => setTimeout(resolve, 320));
        }

        if (isSpotifyToYouTube) {
          // Spotify ➔ YouTube Match
          const searchResult = await searchYouTubeTrack(
            youtubeAccessToken,
            cleaned.cleanedTitle,
            cleaned.cleanedArtist,
            track.durationSec,
            isDemo
          );

          if (searchResult.track) {
            matchedCount++;
            matchedTargetIdsOrUris.push(searchResult.track.id);

            const recon: TrackReconciliation = {
              index,
              sourceTrack: track,
              cleaned,
              status: 'MATCHED',
              youtubeTrack: searchResult.track,
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
              message: `✓ Matched: "${cleaned.cleanedTitle}" ➔ YouTube: "${searchResult.track.name}" (${searchResult.track.artist})`,
              logLevel: 'success',
            });
          } else {
            unmatchedCount++;
            const recon: TrackReconciliation = {
              index,
              sourceTrack: track,
              cleaned,
              status: 'UNMATCHED',
              reason: searchResult.reason || 'No matching YouTube video found within duration tolerance',
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
        } else {
          // YouTube ➔ Spotify Match
          const searchResult = await searchSpotifyTrack(
            spotifyAccessToken,
            cleaned,
            isDemo
          );

          if (searchResult.track) {
            matchedCount++;
            matchedTargetIdsOrUris.push(searchResult.track.uri);

            const recon: TrackReconciliation = {
              index,
              sourceTrack: track,
              cleaned,
              status: 'MATCHED',
              spotifyTrack: searchResult.track,
              targetTrackTitle: searchResult.track.name,
              targetTrackArtist: searchResult.track.artist,
              targetTrackUrl: searchResult.track.spotifyUrl,
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
              message: `✓ Matched: "${cleaned.cleanedTitle}" ➔ Spotify: "${searchResult.track.name}" (${searchResult.track.artist})`,
              logLevel: 'success',
            });
          } else {
            unmatchedCount++;
            const recon: TrackReconciliation = {
              index,
              sourceTrack: track,
              cleaned,
              status: 'UNMATCHED',
              reason: searchResult.reason || 'No matching Spotify track found within duration tolerance',
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
      }

      // 4. Create Target Playlist
      const targetPlaylistName = customName || `[Migrated] ${sourcePlaylistTitle}`;
      const targetPlatformName = isSpotifyToYouTube ? 'YouTube Music' : 'Spotify';

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
        message: `Creating ${targetPlatformName} playlist "${targetPlaylistName}"...`,
        logLevel: 'info',
      });

      let targetPlaylistResult: { id: string; url: string };

      if (isSpotifyToYouTube) {
        targetPlaylistResult = await createYouTubePlaylist(
          youtubeAccessToken,
          targetPlaylistName,
          `Migrated from Spotify playlist "${sourcePlaylistTitle}" with PlaylistBridge on ${new Date().toLocaleDateString()}`,
          isDemo
        );
      } else {
        targetPlaylistResult = await createSpotifyPlaylist(
          spotifyAccessToken,
          session.spotify?.userId || 'demo_user',
          targetPlaylistName,
          `Migrated from YouTube Music playlist "${sourcePlaylistTitle}" with PlaylistBridge on ${new Date().toLocaleDateString()}`,
          isDemo
        );
      }

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
          message: `Adding ${matchedTargetIdsOrUris.length} tracks to ${targetPlatformName} playlist...`,
          logLevel: 'info',
        });

        if (isSpotifyToYouTube) {
          await addTracksToYouTubePlaylist(
            youtubeAccessToken,
            targetPlaylistResult.id,
            matchedTargetIdsOrUris,
            isDemo
          );
        } else {
          await addTracksToSpotifyPlaylist(
            spotifyAccessToken,
            targetPlaylistResult.id,
            matchedTargetIdsOrUris,
            isDemo
          );
        }
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
        message: `Migration completed in ${(elapsedMs / 1000).toFixed(1)}s! Successfully created ${targetPlatformName} playlist with ${matchedCount} matched tracks.`,
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
