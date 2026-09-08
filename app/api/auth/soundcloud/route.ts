import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.soundcloud = {
    accessToken: 'soundcloud_token_' + Date.now(),
    displayName: 'SoundCloud User',
    userId: 'soundcloud_user_' + Date.now().toString(36),
  };
  const response = NextResponse.redirect(new URL('/?connected=soundcloud', request.nextUrl.origin));
  setSessionCookie(response, session);
  return response;
}
