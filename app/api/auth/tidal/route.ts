import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.tidal = {
    accessToken: 'tidal_token_' + Date.now(),
    displayName: 'TIDAL HiFi User',
    userId: 'tidal_user_' + Date.now().toString(36),
  };
  const response = NextResponse.redirect(new URL('/?connected=tidal', request.nextUrl.origin));
  setSessionCookie(response, session);
  return response;
}
