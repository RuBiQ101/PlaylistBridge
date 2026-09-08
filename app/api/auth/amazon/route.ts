import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.amazon = {
    accessToken: 'amazon_token_' + Date.now(),
    displayName: 'Amazon Music User',
    userId: 'amazon_user_' + Date.now().toString(36),
  };
  const response = NextResponse.redirect(new URL('/?connected=amazon', request.nextUrl.origin));
  setSessionCookie(response, session);
  return response;
}
