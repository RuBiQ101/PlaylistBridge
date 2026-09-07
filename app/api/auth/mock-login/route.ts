import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform, enableAll } = body;

    const session = await getSession();
    session.isDemoMode = true;

    if (enableAll || platform === 'all') {
      session.spotify = {
        accessToken: 'demo_token_spotify',
        userId: 'demo_user_123',
        displayName: 'Demo User (Spotify)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
      session.youtube = {
        accessToken: 'demo_token_youtube',
        channelTitle: 'Demo Curator Channel',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      };
    } else if (platform === 'spotify') {
      session.spotify = {
        accessToken: 'demo_token_spotify',
        userId: 'demo_user_123',
        displayName: 'Demo User (Spotify)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
    } else if (platform === 'youtube') {
      session.youtube = {
        accessToken: 'demo_token_youtube',
        channelTitle: 'Demo Curator Channel',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      };
    }

    const res = NextResponse.json({ success: true, session });
    setSessionCookie(res, session);
    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
