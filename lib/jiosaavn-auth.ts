/**
 * JioSaavn / Jio Music OAuth 2.0 Helper Library
 * 
 * JioSaavn uses the Jio SSO (Single Sign-On) OAuth 2.0 flow via JioID.
 * Developer Portal: https://developer.jiosaavn.com (or Jio Partner Portal)
 * 
 * OAuth 2.0 Endpoints:
 *   Authorization: https://sso.jio.com/sso/oauth2/authorize
 *   Token:         https://sso.jio.com/sso/oauth2/token
 *   User Profile:  https://sso.jio.com/sso/oauth2/userinfo
 */

export interface JioSaavnTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  scope?: string;
}

export interface JioSaavnUserProfile {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  isPro?: boolean;
}

// Jio SSO OAuth 2.0 Endpoints
const JIOSAAVN_AUTH_URL = 'https://sso.jio.com/sso/oauth2/authorize';
const JIOSAAVN_TOKEN_URL = 'https://sso.jio.com/sso/oauth2/token';
const JIOSAAVN_USERINFO_URL = 'https://sso.jio.com/sso/oauth2/userinfo';

// Environment variables
const JIOSAAVN_CLIENT_ID = process.env.JIOSAAVN_CLIENT_ID || '';
const JIOSAAVN_CLIENT_SECRET = process.env.JIOSAAVN_CLIENT_SECRET || '';
const JIOSAAVN_REDIRECT_URI =
  process.env.JIOSAAVN_REDIRECT_URI || 'http://127.0.0.1:3000/api/auth/jiosaavn/callback';

// Scopes for JioSaavn access
export const JIOSAAVN_SCOPES = [
  'openid',
  'profile',
  'email',
  'music:read',
  'music:write',
  'playlist:read',
  'playlist:write',
].join(' ');

/**
 * Generates JioSaavn / Jio SSO OAuth 2.0 authorization URL
 */
export function getJioSaavnAuthUrl(
  customRedirectUri?: string,
  state: string = 'jiosaavn_auth'
): string {
  const redirectUri = customRedirectUri || JIOSAAVN_REDIRECT_URI;

  const params = new URLSearchParams({
    client_id: JIOSAAVN_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: JIOSAAVN_SCOPES,
    state,
    prompt: 'consent',
  });

  return `${JIOSAAVN_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchanges authorization code for JioSaavn tokens
 */
export async function exchangeJioSaavnCode(
  code: string,
  customRedirectUri?: string
): Promise<JioSaavnTokenResponse> {
  const redirectUri = customRedirectUri || JIOSAAVN_REDIRECT_URI;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: JIOSAAVN_CLIENT_ID,
    client_secret: JIOSAAVN_CLIENT_SECRET,
    redirect_uri: redirectUri,
  });

  const response = await fetch(JIOSAAVN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`JioSaavn token exchange failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    tokenType: data.token_type || 'Bearer',
    expiresIn: data.expires_in || 3600,
    scope: data.scope,
  };
}

/**
 * Refreshes an expired JioSaavn access token using the refresh token
 */
export async function refreshJioSaavnAccessToken(
  refreshToken: string
): Promise<JioSaavnTokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: JIOSAAVN_CLIENT_ID,
    client_secret: JIOSAAVN_CLIENT_SECRET,
  });

  const response = await fetch(JIOSAAVN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`JioSaavn token refresh failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    tokenType: data.token_type || 'Bearer',
    expiresIn: data.expires_in || 3600,
    scope: data.scope,
  };
}

/**
 * Gets the current JioSaavn user's profile using the OAuth 2.0 userinfo endpoint
 */
export async function getJioSaavnUserProfile(
  accessToken: string
): Promise<JioSaavnUserProfile> {
  const response = await fetch(JIOSAAVN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch JioSaavn user profile: ${errorText}`);
  }

  const data = await response.json();
  return {
    userId: data.sub || data.user_id || data.jioId || data.id,
    name: data.name || data.display_name || data.username || 'JioSaavn User',
    email: data.email,
    phone: data.phone_number || data.mobile,
    avatarUrl: data.picture || data.avatar_url || data.profile_image,
    isPro: data.is_pro || data.subscription_status === 'pro',
  };
}
