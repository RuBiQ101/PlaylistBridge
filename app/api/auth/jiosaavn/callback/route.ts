import { NextRequest, NextResponse } from 'next/server';
import { exchangeJioSaavnCode, getJioSaavnUserProfile } from '@/lib/jiosaavn-auth';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const rawState = searchParams.get('state');
  const returnOrigin = rawState ? decodeURIComponent(rawState) : request.nextUrl.origin;
  const redirectHost = returnOrigin || request.nextUrl.origin;

  if (error || !code) {
    console.error('JioSaavn OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?auth_error=jiosaavn_${error || 'missing_code'}`, redirectHost)
    );
  }

  try {
    const redirectUri =
      process.env.JIOSAAVN_REDIRECT_URI || `${redirectHost}/api/auth/jiosaavn/callback`;
    const tokenData = await exchangeJioSaavnCode(code, redirectUri);
    const profile = await getJioSaavnUserProfile(tokenData.accessToken);

    const session = await getSession();
    session.jiosaavn = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: Date.now() + tokenData.expiresIn * 1000,
      userId: profile.userId,
      displayName: profile.name || 'JioSaavn User',
      avatarUrl: profile.avatarUrl,
    };
    session.isDemoMode = false;

    // Update the in-memory global bridge immediately
    global.__playlistBridgeSession = session;

    const res = NextResponse.redirect(new URL('/?connected=jiosaavn', redirectHost));
    setSessionCookie(res, session);
    return res;
  } catch (err: any) {
    console.error('JioSaavn OAuth callback failed:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=jiosaavn_token_exchange_failed`, redirectHost)
    );
  }
}
