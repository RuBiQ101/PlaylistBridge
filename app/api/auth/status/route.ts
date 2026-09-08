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
        channelTitle: session.youtube?.channelTitle || session.youtube?.displayName,
        displayName: session.youtube?.displayName || session.youtube?.channelTitle,
        avatarUrl: session.youtube?.avatarUrl,
      },
      apple: {
        connected: !!session.apple?.accessToken,
        displayName: session.apple?.displayName,
        userId: session.apple?.userId,
        avatarUrl: session.apple?.avatarUrl,
      },
      amazon: {
        connected: !!session.amazon?.accessToken,
        displayName: session.amazon?.displayName,
        userId: session.amazon?.userId,
        avatarUrl: session.amazon?.avatarUrl,
      },
      jiosaavn: {
        connected: !!session.jiosaavn?.accessToken,
        displayName: session.jiosaavn?.displayName,
        userId: session.jiosaavn?.userId,
        avatarUrl: session.jiosaavn?.avatarUrl,
      },
      soundcloud: {
        connected: !!session.soundcloud?.accessToken,
        displayName: session.soundcloud?.displayName,
        userId: session.soundcloud?.userId,
        avatarUrl: session.soundcloud?.avatarUrl,
      },
      tidal: {
        connected: !!session.tidal?.accessToken,
        displayName: session.tidal?.displayName,
        userId: session.tidal?.userId,
        avatarUrl: session.tidal?.avatarUrl,
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
