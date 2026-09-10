import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import { fetchUserPlaylists, refreshYouTubeToken } from '@/lib/youtube';
import { MOCK_YOUTUBE_PLAYLISTS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    let accessToken = session.youtube?.accessToken;
    const refreshToken = session.youtube?.refreshToken;
    const expiresAt = session.youtube?.expiresAt;

    // Check if token is expired and can be refreshed
    if (refreshToken && expiresAt && Date.now() > expiresAt - 60000) {
      try {
        const refreshed = await refreshYouTubeToken(refreshToken);
        accessToken = refreshed.accessToken;
        if (session.youtube) {
          session.youtube.accessToken = refreshed.accessToken;
          session.youtube.expiresAt = Date.now() + refreshed.expiresIn * 1000;
          await saveSession(session);
        }
      } catch (refErr) {
        console.warn('Failed to refresh YouTube token:', refErr);
      }
    }

    const hasRealToken = !!accessToken && accessToken !== 'demo_token';

    let playlists = await fetchUserPlaylists(
      accessToken || 'demo_token',
      !hasRealToken
    );

    if (!playlists || playlists.length <= 1) {
      playlists = MOCK_YOUTUBE_PLAYLISTS;
    }

    return NextResponse.json({ playlists });
  } catch (error: any) {
    console.error('Failed to fetch YouTube playlists:', error);
    return NextResponse.json({ playlists: MOCK_YOUTUBE_PLAYLISTS });
  }
}
