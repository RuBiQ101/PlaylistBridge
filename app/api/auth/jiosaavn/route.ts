import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/jiosaavn
 * 
 * Fallback redirect for JioSaavn auth.
 * Since JioSaavn doesn't have a public OAuth 2.0 API, the primary flow 
 * is the embedded login dialog (POST /api/auth/jiosaavn/login).
 * 
 * This GET route serves as a fallback that redirects back to the app
 * and triggers the login dialog.
 */
export async function GET(request: NextRequest) {
  const redirectHost =
    process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin || 'http://127.0.0.1:3000';

  // Redirect back to the app — the frontend will show the JioSaavn login dialog
  return NextResponse.redirect(
    new URL('/?connect=jiosaavn', redirectHost)
  );
}
