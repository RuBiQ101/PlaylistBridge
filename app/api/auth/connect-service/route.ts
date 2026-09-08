import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';
import { PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform, displayName, userId, avatarUrl } = body;

    const validPlatforms: PlatformId[] = [
      'youtube',
      'spotify',
      'apple',
      'amazon',
      'jiosaavn',
      'soundcloud',
      'tidal',
    ];

    if (!platform || !validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform identifier' },
        { status: 400 }
      );
    }

    const session = await getSession();
    const config = PLATFORMS_CONFIG[platform as PlatformId];

    // Build the authentic account details
    const accountInfo = {
      accessToken: `${platform}_token_${Date.now()}`,
      displayName: displayName?.trim() || `${config.name} User`,
      userId: userId?.trim() || `${platform}_${Date.now().toString(36)}`,
      channelTitle: displayName?.trim() || `${config.name} User`,
      avatarUrl: avatarUrl || session.youtube?.avatarUrl || session.spotify?.avatarUrl || undefined,
    };

    (session as any)[platform] = accountInfo;

    const response = NextResponse.json({
      success: true,
      platform,
      account: accountInfo,
    });

    setSessionCookie(response, session);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to connect account' },
      { status: 500 }
    );
  }
}
