import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  session.soundcloud = {
    accessToken: 'soundcloud_token_' + Date.now(),
    displayName: 'SoundCloud Go+ User',
    userId: 'soundcloud_user_id',
  };
  await saveSession(session);
  return NextResponse.redirect(new URL('/?connected=soundcloud', request.url));
}
