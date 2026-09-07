import { NextRequest } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import { fetchPlaylistTracks, fetchUserPlaylists } from '@/lib/youtube';
import { cleanTrackMetadata } from '@/lib/normalization';
import {
  searchSpotifyTrack,
  createSpotifyPlaylist,
  addTracksToSpotifyPlaylist,
  refreshSpotifyAccessToken,
} from '@/lib/spotify';
import {
  MigrationProgressEvent,
  TrackReconciliation,
  YouTubeTrack,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistId = searchParams.get('playlistId');
  const customName = searchParams.get('customName');

  if (!playlistId) {
    return new Response(JSON.stringify({ error: 'Missing playlistId parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await getSession();
  const isDemo = session.isDemoMode || !session.spotify?.accessToken;

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
    try {
      // 1. Initialize Transfer
      await sendEvent({
        type: 'INIT',
        playlistId,
        totalTracks: 0,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: 'Initializing transfer pipeline...',
        logLevel: 'info',
      });

      // 2. Fetch Source Playlist Info & Tracks
      await sendEvent({
        type: 'FETCHING_SOURCE',
        playlistId,
        totalTracks: 0,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: 'Fetching YouTube Music playlist tracks and metadata...',
        logLevel: 'info',
      });

      const allPlaylists = await fetchUserPlaylists(
        session.youtube?.accessToken || 'demo_token',
        isDemo
      );
      const sourcePlaylist = allPlaylists.find((p) => p.id === playlistId) || {
        id: playlistId,
        title: customName || 'Imported Playlist',
        description: '',
        thumbnailUrl: '',
        itemCount: 0,
        channelTitle: '',
      };

      const tracks: YouTubeTrack[] = await fetchPlaylistTracks(
        session.youtube?.accessToken || 'demo_token',
        playlistId,
        isDemo
      );

      const totalTracks = tracks.length;
      let matchedCount = 0;
      let unmatchedCount = 0;
      const matchedUris: string[] = [];
      const reconciliations: TrackReconciliation[] = [];

      await sendEvent({
        type: 'FETCHING_SOURCE',
        playlistId,
        playlistTitle: sourcePlaylist.title,
        totalTracks,
        currentIndex: 0,
        matchedCount: 0,
        unmatchedCount: 0,
        message: `Found ${totalTracks} tracks in "${sourcePlaylist.title}". Starting normalization and matching engine...`,
        logLevel: 'info',
      });

      // 3. Process Each Track
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const index = i + 1;

        // Clean & Normalize Track Metadata
        const cleaned = cleanTrackMetadata(
          track.title,
          track.channelTitle,
          track.durationSec
        );

        // Notify client: Searching
        await sendEvent({
          type: 'TRACK_SEARCHING',
          playlistId,
          playlistTitle: sourcePlaylist.title,
          totalTracks,
          currentIndex: index,
          matchedCount,
          unmatchedCount,
          message: `[${index}/${totalTracks}] Normalizing: "${cleaned.cleanedTitle}" by "${cleaned.cleanedArtist}"...`,
          logLevel: 'info',
        });

        // Small delay in demo mode for realistic visual feedback
        if (isDemo) {
          await new Promise((resolve) => setTimeout(resolve, 350));
        }

        // Search Spotify Catalog + ±12s Duration Check
        const searchResult = await searchSpotifyTrack(
          spotifyAccessToken,
          cleaned,
          isDemo
        );

        if (searchResult.track) {
          matchedCount++;
          matchedUris.push(searchResult.track.uri);

          const recon: TrackReconciliation = {
            index,
            sourceTrack: track,
            cleaned,
            status: 'MATCHED',
            spotifyTrack: searchResult.track,
            timestamp: new Date().toLocaleTimeString(),
          };
          reconciliations.push(recon);

          await sendEvent({
            type: 'TRACK_MATCHED',
            playlistId,
            playlistTitle: sourcePlaylist.title,
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
            playlistTitle: sourcePlaylist.title,
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

      // 4. Create Spotify Playlist
      const spotifyPlaylistName = customName || `[Migrated] ${sourcePlaylist.title}`;
      await sendEvent({
        type: 'CREATING_SPOTIFY_PLAYLIST',
        playlistId,
        playlistTitle: sourcePlaylist.title,
        totalTracks,
        currentIndex: totalTracks,
        matchedCount,
        unmatchedCount,
        message: `Creating Spotify playlist "${spotifyPlaylistName}"...`,
        logLevel: 'info',
      });

      const newPlaylist = await createSpotifyPlaylist(
        spotifyAccessToken,
        session.spotify?.userId || 'demo_user',
        spotifyPlaylistName,
        `Migrated from YouTube Music playlist "${sourcePlaylist.title}" with PlaylistBridge on ${new Date().toLocaleDateString()}`,
        isDemo
      );

      // 5. Batch Add Tracks to Spotify Playlist
      let tracksAddedSuccessfully = 0;
      if (matchedUris.length > 0) {
        await sendEvent({
          type: 'ADDING_TRACKS',
          playlistId,
          playlistTitle: sourcePlaylist.title,
          totalTracks,
          currentIndex: totalTracks,
          matchedCount,
          unmatchedCount,
          spotifyPlaylistId: newPlaylist.id,
          spotifyPlaylistUrl: newPlaylist.url,
          message: `Adding ${matchedUris.length} tracks to Spotify playlist in chunks...`,
          logLevel: 'info',
        });

        const addResult = await addTracksToSpotifyPlaylist(
          spotifyAccessToken,
          newPlaylist.id,
          matchedUris,
          isDemo
        );
        tracksAddedSuccessfully = addResult.addedCount;

        if (addResult.addedCount === 0 && matchedUris.length > 0) {
          await sendEvent({
            type: 'LOG',
            playlistId,
            totalTracks,
            currentIndex: totalTracks,
            matchedCount,
            unmatchedCount,
            message: `⚠️ Note: Playlist "${spotifyPlaylistName}" created on Spotify! (If track insertion returned 403, please re-click "Connect with Spotify" in Step 1 to refresh playlist write permissions).`,
            logLevel: 'warn',
          });
        }
      }

      // 6. Complete
      const elapsedMs = Date.now() - startTime;
      await sendEvent({
        type: 'COMPLETE',
        playlistId,
        playlistTitle: sourcePlaylist.title,
        totalTracks,
        currentIndex: totalTracks,
        matchedCount,
        unmatchedCount,
        spotifyPlaylistId: newPlaylist.id,
        spotifyPlaylistUrl: newPlaylist.url,
        message: `Migration completed in ${(elapsedMs / 1000).toFixed(1)}s! Successfully created Spotify playlist with ${matchedCount} matched tracks.`,
        logLevel: 'success',
      });
    } catch (err: any) {
      console.error('Migration SSE stream failed:', err);
      await sendEvent({
        type: 'ERROR',
        playlistId,
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
