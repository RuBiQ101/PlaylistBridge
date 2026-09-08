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
      apple: {
        connected: !!session.apple?.accessToken || true,
        displayName: session.apple?.displayName || 'Apple Music User',
        avatarUrl: session.apple?.avatarUrl,
      },
      amazon: {
        connected: !!session.amazon?.accessToken || true,
        displayName: session.amazon?.displayName || 'Amazon Music User',
        avatarUrl: session.amazon?.avatarUrl,
      },
      jiosaavn: {
        connected: !!session.jiosaavn?.accessToken || true,
        displayName: session.jiosaavn?.displayName || 'JioSaavn User',
        avatarUrl: session.jiosaavn?.avatarUrl,
      },
      soundcloud: {
        connected: !!session.soundcloud?.accessToken || true,
        displayName: session.soundcloud?.displayName || 'SoundCloud Artist',
        avatarUrl: session.soundcloud?.avatarUrl,
      },
      tidal: {
        connected: !!session.tidal?.accessToken || true,
        displayName: session.tidal?.displayName || 'TIDAL HiFi User',
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
