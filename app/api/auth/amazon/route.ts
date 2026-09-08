import { NextRequest, NextResponse } from 'next/server';
import { getAmazonAuthUrl } from '@/lib/amazon';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.AMAZON_CLIENT_ID;

  const redirectHost =
    process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || 'http://127.0.0.1:3000';

  if (!clientId || clientId === 'your_amazon_client_id_here') {
    return NextResponse.redirect(
      new URL('/?auth_error=amazon_credentials_missing', redirectHost)
    );
  }

  const redirectUri =
    process.env.AMAZON_REDIRECT_URI || `${redirectHost}/api/auth/amazon/callback`;
  const state = encodeURIComponent(redirectHost);
  const authUrl = getAmazonAuthUrl(redirectUri, state);

  return NextResponse.redirect(authUrl);
}
