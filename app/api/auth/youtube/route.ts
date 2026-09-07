import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeAuthUrl } from '@/lib/youtube';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId === 'your_google_client_id_here') {
    return NextResponse.redirect(new URL('/?error=google_credentials_missing', request.nextUrl.origin));
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/youtube/callback`;
  const authUrl = getYouTubeAuthUrl(redirectUri);
  return NextResponse.redirect(authUrl);
}
