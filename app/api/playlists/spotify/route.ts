import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchUserSpotifyPlaylists } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    const hasRealToken =
      !!session.spotify?.accessToken && session.spotify.accessToken !== 'demo_token';

    const playlists = await fetchUserSpotifyPlaylists(
      session.spotify?.accessToken || 'demo_token',
      !hasRealToken
    );

    return NextResponse.json({ playlists });


  } catch (error: any) {
    console.error('Failed to fetch Spotify playlists:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
