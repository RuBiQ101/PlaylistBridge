import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  session.tidal = {
    accessToken: 'tidal_token_' + Date.now(),
    displayName: 'TIDAL HiFi Plus User',
    userId: 'tidal_user_id',
  };
  await saveSession(session);
  return NextResponse.redirect(new URL('/?connected=tidal', request.url));
}
