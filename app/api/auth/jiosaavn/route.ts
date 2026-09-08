import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  session.jiosaavn = {
    accessToken: 'jiosaavn_token_' + Date.now(),
    displayName: 'JioSaavn Pro User',
    userId: 'jiosaavn_user_id',
  };
  await saveSession(session);
  return NextResponse.redirect(new URL('/?connected=jiosaavn', request.url));
}
