/**
 * Amazon Music / Login with Amazon (LWA) OAuth 2.0 Helper Library
 */

export interface AmazonTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
}

export interface AmazonUserProfile {
  userId: string;
  name: string;
  email?: string;
  postalCode?: string;
}

const AMAZON_AUTH_URL = 'https://www.amazon.com/ap/oa';
const AMAZON_TOKEN_URL = 'https://api.amazon.com/auth/o2/token';
const AMAZON_PROFILE_URL = 'https://api.amazon.com/user/profile';

export function getAmazonAuthUrl(redirectUri: string, state: string): string {
  const clientId = process.env.AMAZON_CLIENT_ID || '';
  const scope = encodeURIComponent('profile');

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'profile',
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
  });

  return `${AMAZON_AUTH_URL}?${params.toString()}`;
}

export async function exchangeAmazonCode(
  code: string,
  redirectUri: string
): Promise<AmazonTokenResponse> {
  const clientId = process.env.AMAZON_CLIENT_ID || '';
  const clientSecret = process.env.AMAZON_CLIENT_SECRET || '';

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetch(AMAZON_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amazon token exchange failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  };
}

export async function getAmazonUserProfile(accessToken: string): Promise<AmazonUserProfile> {
  const response = await fetch(AMAZON_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Amazon user profile: ${errorText}`);
  }

  const data = await response.json();
  return {
    userId: data.user_id,
    name: data.name,
    email: data.email,
    postalCode: data.postal_code,
  };
}
