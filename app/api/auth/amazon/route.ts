import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession();
  session.amazon = {
    accessToken: 'amazon_token_' + Date.now(),
    displayName: 'Amazon Prime Music User',
    userId: 'amazon_user_id',
  };
  await saveSession(session);
  return NextResponse.redirect(new URL('/?connected=amazon', request.url));
}
