import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PLATFORMS_CONFIG, fetchPlatformPlaylists, fetchPlatformPlaylistTracks } from '@/lib/platforms';
import { analyzeLibraryTracks } from '@/lib/analyser';
import { GenericTrack, PlatformId } from '@/lib/types';
import { MOCK_SPOTIFY_PLAYLIST_TRACKS, MOCK_YOUTUBE_TRACKS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const platform = (searchParams.get('platform') || 'youtube') as PlatformId;

    const session = await getSession();
    const isDemo =
      session.isDemoMode ||
      (!session[platform]?.accessToken && session.isDemoMode !== false && !process.env.GOOGLE_CLIENT_ID);

    const accessToken = session[platform]?.accessToken || 'demo_token';

    // 1. Fetch all playlists for the platform
    let playlists = await fetchPlatformPlaylists(platform, accessToken, isDemo).catch(() => []);

    if (!playlists || playlists.length === 0) {
      // Provide fallback mock playlists if demo or empty
      playlists = [
        {
          id: 'mock-pl-1',
          title: 'Daily Favorites & Recaps',
          description: 'Top tracks',
          thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
          itemCount: 20,
        },
      ];
    }

    // 2. Fetch tracks across up to 8 playlists in parallel
    const playlistSubset = playlists.slice(0, 8);
    const allTracks: GenericTrack[] = [];

    const trackPromises = playlistSubset.map(async (pl) => {
      try {
        const trs = await fetchPlatformPlaylistTracks(platform, accessToken, pl.id, isDemo);
        return trs;
      } catch (e) {
        return [];
      }
    });

    const results = await Promise.all(trackPromises);
    for (const trList of results) {
      allTracks.push(...trList);
    }

    // If still empty (e.g. demo mode or new account), seed with sample multi-genre tracks
    if (allTracks.length === 0) {
      const mockPool = [
        ...Object.values(MOCK_YOUTUBE_TRACKS).flat(),
        ...Object.values(MOCK_SPOTIFY_PLAYLIST_TRACKS).flat(),
      ];
      allTracks.push(...mockPool);
    }


    // 3. Run Music Intelligence Taste Analysis
    const analysis = analyzeLibraryTracks(allTracks, playlistSubset.length);

    return NextResponse.json({
      analysis,
      scannedPlaylistsCount: playlistSubset.length,
      totalTracks: allTracks.length,
      tracks: allTracks.slice(0, 150), // return sample of scanned tracks for client-side generation
    });
  } catch (error: any) {
    console.error('Taste analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze taste profile' },
      { status: 500 }
    );
  }
}
