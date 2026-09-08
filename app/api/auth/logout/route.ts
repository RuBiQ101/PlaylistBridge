import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform } = body;

    const res = NextResponse.json({ success: true, loggedOut: platform || 'all' });

    if (platform && typeof platform === 'string') {
      const session = await getSession();
      if ((session as any)[platform]) {
        delete (session as any)[platform];
      }
      if (global.__playlistBridgeSession && (global.__playlistBridgeSession as any)[platform]) {
        delete (global.__playlistBridgeSession as any)[platform];
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
