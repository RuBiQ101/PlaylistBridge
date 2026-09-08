import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchUserSpotifyPlaylists } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.spotify?.accessToken && !session.isDemoMode) {
      return NextResponse.json(
        { error: 'Spotify account not connected' },
        { status: 401 }
      );
    }

    const playlists = await fetchUserSpotifyPlaylists(
      session.spotify?.accessToken || 'demo_token',
      session.isDemoMode
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
