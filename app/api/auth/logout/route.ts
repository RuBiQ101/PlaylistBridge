import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform } = body;

    const res = NextResponse.json({ success: true });

    if (platform === 'spotify') {
      const session = await getSession();
      delete session.spotify;
      if (global.__playlistBridgeSession) {
        delete global.__playlistBridgeSession.spotify;
      }
      setSessionCookie(res, session);
    } else if (platform === 'youtube') {
      const session = await getSession();
      delete session.youtube;
      if (global.__playlistBridgeSession) {
        delete global.__playlistBridgeSession.youtube;
      }
      setSessionCookie(res, session);
    } else {
      global.__playlistBridgeSession = undefined;
      clearSessionCookie(res);
    }

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
