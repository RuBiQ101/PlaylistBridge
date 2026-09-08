import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.jiosaavn = {
    accessToken: 'jiosaavn_token_' + Date.now(),
    displayName: 'JioSaavn Pro User',
    userId: 'jiosaavn_user_' + Date.now().toString(36),
  };
  const response = NextResponse.redirect(new URL('/?connected=jiosaavn', request.nextUrl.origin));
  setSessionCookie(response, session);
  return response;
}
