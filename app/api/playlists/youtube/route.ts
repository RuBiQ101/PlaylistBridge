import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchUserPlaylists } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.youtube?.accessToken && !session.isDemoMode) {
      return NextResponse.json(
        { error: 'YouTube account not connected' },
        { status: 401 }
      );
    }

    const playlists = await fetchUserPlaylists(
      session.youtube?.accessToken || 'demo_token',
      session.isDemoMode
    );

    return NextResponse.json({ playlists });
  } catch (error: any) {
    console.error('Failed to fetch YouTube playlists:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
