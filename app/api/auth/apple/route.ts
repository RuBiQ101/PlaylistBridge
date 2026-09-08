import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.apple = {
    accessToken: 'apple_token_' + Date.now(),
    displayName: 'Apple Music Member',
    userId: 'apple_user_' + Date.now().toString(36),
  };
  const response = NextResponse.redirect(new URL('/?connected=apple', request.nextUrl.origin));
  setSessionCookie(response, session);
  return response;
}
