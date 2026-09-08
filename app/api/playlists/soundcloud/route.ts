import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchPlatformPlaylists } from '@/lib/platforms';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    const playlists = await fetchPlatformPlaylists(
      'soundcloud',
      session.soundcloud?.accessToken || 'demo_token',
      true
    );
    return NextResponse.json({ playlists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch playlists' }, { status: 500 });
  }
}
