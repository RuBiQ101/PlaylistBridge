import { NextRequest, NextResponse } from 'next/server';
import { loginToJioSaavn } from '@/lib/jiosaavn';
import { getSession, setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

/**
 * POST /api/auth/jiosaavn/login
 * 
 * Embedded login endpoint — user enters their JioSaavn email/phone + password
 * directly inside PlaylistBridge. We proxy the login server-side and store the
 * session token in our encrypted cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/phone and password are required.' },
        { status: 400 }
      );
    }

    // Call JioSaavn's login API server-side
    const loginResult = await loginToJioSaavn(username, password);

    if (!loginResult.success || !loginResult.token) {
      return NextResponse.json(
        {
          success: false,
          error: loginResult.error || 'Login failed. Please check your credentials.',
        },
        { status: 401 }
      );
    }

    // Save the JioSaavn session to our encrypted cookie
    const session = await getSession();
    session.jiosaavn = {
      accessToken: loginResult.token,
      userId: loginResult.userId,
      displayName: loginResult.displayName || 'JioSaavn User',
      avatarUrl: loginResult.avatarUrl,
    };
    session.isDemoMode = false;

    // Update the in-memory global bridge immediately
    global.__playlistBridgeSession = session;

    const response = NextResponse.json({
      success: true,
      account: {
        displayName: loginResult.displayName,
        userId: loginResult.userId,
        email: loginResult.email,
        avatarUrl: loginResult.avatarUrl,
        isPro: loginResult.isPro,
      },
    });

    setSessionCookie(response, session);
    return response;
  } catch (error: any) {
    console.error('JioSaavn login route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
