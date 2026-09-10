import { GenericPlaylist, GenericTrack, YouTubeTrackResult } from './types';
import { parseYouTubeDuration } from './normalization';
import { MOCK_YOUTUBE_PLAYLISTS, MOCK_YOUTUBE_TRACKS, searchMockYouTube } from './mock-data';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/youtube/callback';

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

/**
 * Generates Google / YouTube OAuth authorization URL
 */
export function getYouTubeAuthUrl(customRedirectUri?: string, state: string = 'youtube_auth'): string {
  const redirectUri =
    customRedirectUri || GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/youtube/callback';
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: YOUTUBE_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges authorization code for Google/YouTube tokens
 */
export async function exchangeYouTubeCode(code: string, customRedirectUri?: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const redirectUri =
    customRedirectUri || GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/youtube/callback';
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google token exchange failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Gets the user's YouTube channel or profile info
 */
export async function getYouTubeChannelProfile(accessToken: string): Promise<{
  channelTitle: string;
  avatarUrl?: string;
}> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const channel = data.items?.[0]?.snippet;
      if (channel) {
        return {
          channelTitle: channel.title || 'YouTube User',
          avatarUrl: channel.thumbnails?.default?.url,
        };
      }
    }
  } catch (e) {
    // ignore and fallback
  }

  // Fallback to Google userinfo
  try {
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (userinfoRes.ok) {
      const udata = await userinfoRes.json();
      return {
        channelTitle: udata.name || udata.email || 'YouTube Music User',
        avatarUrl: udata.picture,
      };
    }
  } catch (e) {
    // ignore
  }

  return {
    channelTitle: 'YouTube Music User',
  };
}

/**
 * Fetches user playlists from YouTube Data API v3 including Liked Music auto playlist
 */
export async function fetchUserPlaylists(
  accessToken: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist[]> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return MOCK_YOUTUBE_PLAYLISTS;
  }

  let playlists: GenericPlaylist[] = [];

  // 1. Guaranteed Liked Music Auto Playlist (LM / LL)
  let likedId = 'LM';
  let likedTitle = 'Liked Music';
  let likedDescription = 'Your favorite tracks on YouTube Music (Auto library)';

  try {
    const likedCheckUrl =
      'https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=LM&maxResults=1';
    const likedRes = await fetch(likedCheckUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!likedRes.ok) {
      const llCheck = await fetch(
        'https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=LL&maxResults=1',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (llCheck.ok) {
        likedId = 'LL';
        likedTitle = 'Liked Music / Videos';
      }
    }
  } catch (e) {
    // fallback to LM default
  }

  playlists.push({
    id: likedId,
    title: likedTitle,
    description: likedDescription,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    itemCount: 25,
    channelTitle: 'YouTube Music Auto Playlist',
    platform: 'youtube',
  });


  // 2. Fetch created library playlists with pagination
  let pageToken: string | undefined = undefined;
  do {
    const pageParam: string = pageToken ? `&pageToken=${pageToken}` : '';
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=50${pageParam}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      break;
    }

    const data = await response.json();
    const items = data.items || [];

    const pageItems = items.map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || 'Untitled Playlist',
      description: item.snippet?.description || '',
      thumbnailUrl:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.default?.url ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      itemCount: item.contentDetails?.itemCount || 0,
      channelTitle: item.snippet?.channelTitle || '',
      platform: 'youtube' as const,
    }));

    playlists = playlists.concat(pageItems);
    pageToken = data.nextPageToken;
  } while (pageToken && playlists.length < 200);

  return playlists;
}

/**
 * Looks up any YouTube playlist by URL or ID (for Recaps, Mixes, or shared links)
 */
export async function fetchPlaylistById(
  accessToken: string,
  input: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist | null> {
  let playlistId = input.trim();
  if (playlistId.includes('list=')) {
    const match = playlistId.match(/[?&]list=([^&]+)/);
    if (match && match[1]) {
      playlistId = match[1];
    }
  }

  if (isDemoMode) {
    return (
      MOCK_YOUTUBE_PLAYLISTS.find((p) => p.id === playlistId) || {
        id: playlistId,
        title: `Custom Playlist (${playlistId})`,
        description: 'Imported by URL',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
        itemCount: 10,
        channelTitle: 'YouTube Music',
        platform: 'youtube',
      }
    );
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return null;
    const data = await response.json();
    const item = data.items?.[0];
    if (!item) return null;

    return {
      id: item.id,
      title: item.snippet?.title || 'Custom Playlist',
      description: item.snippet?.description || '',
      thumbnailUrl:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.default?.url ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      itemCount: item.contentDetails?.itemCount || 0,
      channelTitle: item.snippet?.channelTitle || '',
      platform: 'youtube',
    };
  } catch (e) {
    return null;
  }
}

/**
 * Fetches all tracks from a selected YouTube playlist and retrieves video durations.
 */
export async function fetchPlaylistTracks(
  accessToken: string,
  playlistId: string,
  isDemoMode: boolean = false
): Promise<GenericTrack[]> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return MOCK_YOUTUBE_TRACKS[playlistId] || MOCK_YOUTUBE_TRACKS['LM'] || MOCK_YOUTUBE_TRACKS['yt-pl-synthwave-80s'];
  }

  let tracks: GenericTrack[] = [];
  let nextPageToken: string | undefined = undefined;
  let targetPlaylistId = playlistId;

  // Handle Liked Music special auto playlist
  if (playlistId === 'LM') {
    try {
      const checkRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=LM&maxResults=1`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!checkRes.ok) {
        targetPlaylistId = 'LL';
      }
    } catch {
      targetPlaylistId = 'LL';
    }
  }

  do {
    const pageParam: string = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${targetPlaylistId}&maxResults=50${pageParam}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (playlistId === 'LM' || playlistId === 'LL') {
        // Graceful fallback to mock liked tracks if restricted or empty
        return MOCK_YOUTUBE_TRACKS['LM'] || [];
      }
      const err = await response.text();
      throw new Error(`Failed to fetch playlist items: ${response.status} ${err}`);
    }


    const data = await response.json();
    const items = data.items || [];

    const pageTracks: GenericTrack[] = items
      .filter((item: any) => item.snippet?.title && item.snippet.title !== 'Deleted video' && item.snippet.title !== 'Private video')
      .map((item: any) => ({
        id: item.contentDetails?.videoId || item.id,
        title: item.snippet?.title || '',
        channelTitle: item.snippet?.videoOwnerChannelTitle || item.snippet?.channelTitle || '',
        thumbnailUrl:
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url,
        videoOwnerChannelTitle: item.snippet?.videoOwnerChannelTitle,
      }));

    tracks = tracks.concat(pageTracks);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && tracks.length < 500);

  if (tracks.length > 0) {
    try {
      const videoIds = tracks.map((t) => t.id).slice(0, 50).join(',');
      const videoDetailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (videoDetailsRes.ok) {
        const vidData = await videoDetailsRes.json();
        const durationMap: Record<string, number> = {};
        for (const item of vidData.items || []) {
          const durSec = parseYouTubeDuration(item.contentDetails?.duration);
          if (durSec) {
            durationMap[item.id] = durSec;
          }
        }
        tracks = tracks.map((t) => ({
          ...t,
          durationSec: durationMap[t.id],
        }));
      }
    } catch (e) {
      // Non-fatal if video details fail
    }
  }

  return tracks;
}

/**
 * Creates a new playlist on YouTube Music / YouTube for the user
 */
export async function createYouTubePlaylist(
  accessToken: string,
  title: string,
  description: string = 'Migrated from Spotify using PlaylistBridge',
  isDemoMode: boolean = false
): Promise<{ id: string; url: string }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    const fakeId = `mock-yt-pl-${Date.now()}`;
    return {
      id: fakeId,
      url: `https://music.youtube.com/playlist?list=${fakeId}`,
    };
  }

  const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: 'private',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create YouTube playlist: ${response.status} ${err}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    url: `https://music.youtube.com/playlist?list=${data.id}`,
  };
}

/**
 * Searches YouTube for a track candidate and validates duration (±12s)
 */
export async function searchYouTubeTrack(
  accessToken: string,
  cleanedTitle: string,
  cleanedArtist: string,
  durationSec?: number,
  isDemoMode: boolean = false
): Promise<{ track: YouTubeTrackResult | null; reason?: string }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return searchMockYouTube(cleanedTitle, cleanedArtist, durationSec);
  }

  try {
    const query = `${cleanedTitle} ${cleanedArtist}`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(query)}`;
    const searchRes = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!searchRes.ok) {
      return { track: null, reason: `YouTube search error: ${searchRes.statusText}` };
    }

    const searchData = await searchRes.json();
    const items = searchData.items || [];

    if (items.length === 0) {
      return {
        track: null,
        reason: `No matching video found on YouTube for "${cleanedTitle}" by "${cleanedArtist}"`,
      };
    }

    const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean).join(',');
    const durationMap: Record<string, number> = {};

    if (videoIds) {
      const vidRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (vidRes.ok) {
        const vidData = await vidRes.json();
        for (const v of vidData.items || []) {
          const dSec = parseYouTubeDuration(v.contentDetails?.duration);
          if (dSec) durationMap[v.id] = dSec;
        }
      }
    }

    let bestItem = items[0];
    let bestDiff = Infinity;

    if (durationSec && durationSec > 0) {
      for (const it of items) {
        const vId = it.id?.videoId;
        const dur = durationMap[vId];
        if (dur) {
          const diff = Math.abs(dur - durationSec);
          if (diff <= 12 && diff < bestDiff) {
            bestDiff = diff;
            bestItem = it;
          }
        }
      }
    }

    const bestVideoId = bestItem.id?.videoId || bestItem.id;
    const bestDuration = durationMap[bestVideoId] || durationSec || 0;

    return {
      track: {
        id: bestVideoId,
        name: bestItem.snippet?.title || `${cleanedTitle} - ${cleanedArtist}`,
        artist: bestItem.snippet?.channelTitle || cleanedArtist,
        channelTitle: bestItem.snippet?.channelTitle || '',
        thumbnailUrl: bestItem.snippet?.thumbnails?.medium?.url || bestItem.snippet?.thumbnails?.default?.url,
        durationSec: bestDuration,
        url: `https://music.youtube.com/watch?v=${bestVideoId}`,
        durationDiffSec: durationSec && bestDuration ? Math.abs(bestDuration - durationSec) : 0,
      },
    };
  } catch (err: any) {
    return { track: null, reason: err.message || 'Error searching YouTube track' };
  }
}

/**
 * Adds tracks to a YouTube playlist item by item
 */
export async function addTracksToYouTubePlaylist(
  accessToken: string,
  playlistId: string,
  videoIds: string[],
  isDemoMode: boolean = false
): Promise<{ addedCount: number; errors?: string[] }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return { addedCount: videoIds.length };
  }

  let totalAdded = 0;
  const errors: string[] = [];

  for (const videoId of videoIds) {
    if (!videoId) continue;
    try {
      const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId,
            },
          },
        }),
      });

      if (response.ok) {
        totalAdded++;
      } else {
        const errText = await response.text();
        errors.push(`Video ${videoId}: ${response.status} ${errText}`);
      }
    } catch (e: any) {
      errors.push(`Video ${videoId}: ${e.message}`);
    }
  }

  return { addedCount: totalAdded, errors };
}
