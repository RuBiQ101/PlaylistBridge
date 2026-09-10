import { NextRequest, NextResponse } from 'next/server';
import { exchangeYouTubeCode, getYouTubeChannelProfile } from '@/lib/youtube';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const redirectHost = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/?auth_error=youtube_${error || 'missing_code'}`, redirectHost)
    );
  }

  try {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${redirectHost}/api/auth/youtube/callback`;
    const tokenData = await exchangeYouTubeCode(code, redirectUri);
    const channelProfile = await getYouTubeChannelProfile(tokenData.accessToken);

    const session = await getSession();
    session.youtube = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: Date.now() + tokenData.expiresIn * 1000,
      channelTitle: channelProfile.channelTitle,
      avatarUrl: channelProfile.avatarUrl,
    };
    session.isDemoMode = false;

    const res = NextResponse.redirect(new URL('/?connected=youtube', redirectHost));
    setSessionCookie(res, session);
    return res;
  } catch (err: any) {
    console.error('YouTube OAuth callback failed:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=youtube_token_exchange_failed`, redirectHost)
    );
  }
}
