import { NextRequest, NextResponse } from 'next/server';
import { exchangeAmazonCode, getAmazonUserProfile } from '@/lib/amazon';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const redirectHost =
    request.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000';

  if (error || !code) {
    console.error('Amazon OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?auth_error=amazon_${error || 'missing_code'}`, redirectHost)
    );
  }

  try {
    const redirectUri =
      process.env.AMAZON_REDIRECT_URI || `${redirectHost}/api/auth/amazon/callback`;
    const tokenData = await exchangeAmazonCode(code, redirectUri);
    const profile = await getAmazonUserProfile(tokenData.accessToken);

    const session = await getSession();
    session.amazon = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: Date.now() + tokenData.expiresIn * 1000,
      userId: profile.userId,
      displayName: profile.name || profile.email || 'Amazon User',
      avatarUrl: undefined,
    };

    const res = NextResponse.redirect(new URL('/?connected=amazon', redirectHost));
    setSessionCookie(res, session);
    return res;
  } catch (err: any) {
    console.error('Amazon OAuth callback failed:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=amazon_token_exchange_failed`, redirectHost)
    );
  }
}
