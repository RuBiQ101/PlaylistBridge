import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { PlatformAuthStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    const status: PlatformAuthStatus = {
      spotify: {
        connected: !!session.spotify?.accessToken,
        userId: session.spotify?.userId,
        displayName: session.spotify?.displayName,
        avatarUrl: session.spotify?.avatarUrl,
      },
      youtube: {
        connected: !!session.youtube?.accessToken,
        channelTitle: session.youtube?.channelTitle,
        avatarUrl: session.youtube?.avatarUrl,
      },
      isDemoMode: !!session.isDemoMode,
    };

    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get auth status' },
      { status: 500 }
    );
  }
}
