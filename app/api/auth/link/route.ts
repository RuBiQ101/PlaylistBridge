import { NextRequest, NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/session';
import { PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { platform, displayName, userId, tier, token, avatarUrl } = body;

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
        { error: 'Invalid or missing platform' },
        { status: 400 }
      );
    }

    const session = await getSession();
    const config = PLATFORMS_CONFIG[platform as PlatformId];

    const accountData = {
      accessToken: token || `${platform}_token_${Date.now()}`,
      displayName: displayName || `${config?.name || platform} User`,
      userId: userId || `${platform}_user_${Date.now().toString(36)}`,
      channelTitle: displayName || `${config?.name || platform} User`,
      avatarUrl: avatarUrl || undefined,
    };

    (session as any)[platform] = accountData;

    const response = NextResponse.json({
      success: true,
      platform,
      account: accountData,
    });

    setSessionCookie(response, session);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to link account' },
      { status: 500 }
    );
  }
}
