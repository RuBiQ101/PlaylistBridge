import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchPlatformPlaylistById } from '@/lib/platforms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json().catch(() => ({}));
    const targetInput =
      body.urlOrId ||
      body.url ||
      body.link ||
      body.id ||
      body.playlistUrl ||
      body.query ||
      body.input;

    if (!targetInput) {
      return NextResponse.json(
        { error: 'Please provide a playlist URL or ID' },
        { status: 400 }
      );
    }

    const playlist = await fetchPlatformPlaylistById(
      'amazon',
      session.amazon?.accessToken || 'demo_token',
      targetInput,
      true
    );

    return NextResponse.json({ playlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Lookup failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const searchParams = request.nextUrl.searchParams;
    const targetInput =
      searchParams.get('urlOrId') ||
      searchParams.get('url') ||
      searchParams.get('link') ||
      searchParams.get('id') ||
      searchParams.get('playlistUrl') ||
      searchParams.get('query') ||
      searchParams.get('input');

    if (!targetInput) {
      return NextResponse.json(
        { error: 'Please provide a playlist URL or ID parameter' },
        { status: 400 }
      );
    }

    const playlist = await fetchPlatformPlaylistById(
      'amazon',
      session.amazon?.accessToken || 'demo_token',
      targetInput,
      true
    );

    return NextResponse.json({ playlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Lookup failed' },
      { status: 500 }
    );
  }
}
