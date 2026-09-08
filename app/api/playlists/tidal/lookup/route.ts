import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchPlatformPlaylistById } from '@/lib/platforms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json().catch(() => ({}));
    const { urlOrId } = body;

    if (!urlOrId) {
      return NextResponse.json({ error: 'Please provide a playlist URL or ID' }, { status: 400 });
    }

    const playlist = await fetchPlatformPlaylistById(
      'tidal',
      session.tidal?.accessToken || 'demo_token',
      urlOrId,
      true
    );

    return NextResponse.json({ playlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lookup failed' }, { status: 500 });
  }
}
