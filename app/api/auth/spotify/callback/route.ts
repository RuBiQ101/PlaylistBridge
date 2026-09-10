import { NextRequest, NextResponse } from 'next/server';
import { exchangeSpotifyCode, getSpotifyUserProfile } from '@/lib/spotify';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const rawState = searchParams.get('state');
  const returnOrigin = rawState ? decodeURIComponent(rawState) : request.nextUrl.origin;
  const redirectHost = process.env.NEXT_PUBLIC_APP_URL || returnOrigin || request.nextUrl.origin || 'http://127.0.0.1:3000';

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/?auth_error=spotify_${error || 'missing_code'}`, redirectHost)
    );
  }

  try {
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || `${redirectHost}/api/auth/spotify/callback`;
    const tokenData = await exchangeSpotifyCode(code, redirectUri);
    const profile = await getSpotifyUserProfile(tokenData.accessToken);

    const session = await getSession();
    session.spotify = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: Date.now() + tokenData.expiresIn * 1000,
      userId: profile.id,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    };
    session.isDemoMode = false;

    // Update the in-memory global bridge immediately
    global.__playlistBridgeSession = session;

    // Redirect to the origin where the user started (e.g. localhost:3000 or 127.0.0.1:3000)
    const res = NextResponse.redirect(new URL('/?connected=spotify', redirectHost));
    setSessionCookie(res, session);
    return res;
  } catch (err: any) {
    console.error('Spotify OAuth callback failed:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=spotify_token_exchange_failed`, redirectHost)
    );
  }
}
