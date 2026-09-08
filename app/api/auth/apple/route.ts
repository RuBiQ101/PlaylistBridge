import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  session.apple = {
    accessToken: 'apple_token_' + Date.now(),
    displayName: 'Apple Music Member',
    userId: 'apple_user_id',
  };
  await saveSession(session);
  return NextResponse.redirect(new URL('/?connected=apple', request.url));
}
