import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId || clientId === 'your_spotify_client_id_here') {
    return NextResponse.redirect(new URL('/?error=spotify_credentials_missing', request.nextUrl.origin));
  }

  const redirectHost =
    process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || 'http://127.0.0.1:3000';
  const redirectUri =
    process.env.SPOTIFY_REDIRECT_URI || `${redirectHost}/api/auth/spotify/callback`;
  const state = encodeURIComponent(redirectHost);
  const authUrl = getSpotifyAuthUrl(redirectUri, state);
  return NextResponse.redirect(authUrl);
}
