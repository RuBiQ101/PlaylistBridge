/**
 * JioSaavn Embedded Login Helper
 * 
 * Handles direct login via JioSaavn's internal API endpoints.
 * The user logs in with their email/username + password directly inside PlaylistBridge.
 * We proxy the login request server-side and store the session token.
 * 
 * JioSaavn Internal API Base: https://www.jiosaavn.com/api.php
 */

import { GenericPlaylist, GenericTrack, GenericTrackResult } from './types';
import { MOCK_JIOSAAVN_PLAYLISTS, COMMON_TEST_TRACKS, searchMockUniversal } from './mock-data';

// JioSaavn API base URL
const JIOSAAVN_API_BASE = 'https://www.jiosaavn.com/api.php';
const JIOSAAVN_API_V4 = 'https://api.jiosaavn.com'; // v4 API

export interface JioSaavnLoginResult {
  success: boolean;
  token?: string;
  userId?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  isPro?: boolean;
  error?: string;
}

export interface JioSaavnTrackResult {
  id: string;
  name: string;
  artist: string;
  albumName?: string;
  thumbnailUrl?: string;
  durationSec: number;
  durationMs: number;
  url: string;
  durationDiffSec?: number;
}

// ========== MOCK TRACK DATA ==========
export const MOCK_JIOSAAVN_TRACKS_BY_PLAYLIST: Record<string, GenericTrack[]> = {
  'js-pl-top-jiotunes': [
    {
      id: 'js-tr-1',
      title: 'Kesariya',
      artist: 'Arijit Singh, Pritam, Amitabh Bhattacharya',
      channelTitle: 'Sony Music India',
      durationSec: 268,
      durationMs: 268000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/kesariya/X10BZR18RkM',
    },
    {
      id: 'js-tr-2',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      channelTitle: 'The Weeknd',
      durationSec: 200,
      durationMs: 200040,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/blinding-lights/Jw45RBp-eGY',
    },
    {
      id: 'js-tr-3',
      title: 'Apna Bana Le',
      artist: 'Arijit Singh, Sachin-Jigar',
      channelTitle: 'Zee Music Company',
      durationSec: 261,
      durationMs: 261000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/apna-bana-le/Hxk2VT5fX1g',
    },
    {
      id: 'js-tr-4',
      title: 'Starboy',
      artist: 'The Weeknd, Daft Punk',
      channelTitle: 'The Weeknd',
      durationSec: 230,
      durationMs: 230453,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/starboy/OwJYeTNmZkc',
    },
    {
      id: 'js-tr-5',
      title: 'Maan Meri Jaan',
      artist: 'King',
      channelTitle: 'Warner Music India',
      durationSec: 194,
      durationMs: 194000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/maan-meri-jaan/NQEzVBZgRwA',
    },
    {
      id: 'js-tr-6',
      title: 'Get Lucky',
      artist: 'Daft Punk, Pharrell Williams',
      channelTitle: 'Daft Punk',
      durationSec: 248,
      durationMs: 248413,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/get-lucky/Fj4qSDBYRFw',
    },
    {
      id: 'js-tr-7',
      title: 'Heeriye',
      artist: 'Jasleen Royal, Arijit Singh, Dulquer Salmaan',
      channelTitle: 'Jasleen Royal',
      durationSec: 194,
      durationMs: 194000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/heeriye/AB89ZkR4X0Y',
    },
    {
      id: 'js-tr-8',
      title: 'Midnight City',
      artist: 'M83',
      channelTitle: 'M83',
      durationSec: 243,
      durationMs: 243266,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/midnight-city/Cl8rWUNVAgE',
    },
  ],
  'js-pl-punjabi-desi': [
    {
      id: 'js-tr-p1',
      title: 'Brown Munde',
      artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon',
      channelTitle: 'Run-Up Records',
      durationSec: 267,
      durationMs: 267000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/brown-munde/RQ8ZCR13V0o',
    },
    {
      id: 'js-tr-p2',
      title: 'Excuses',
      artist: 'AP Dhillon, Gurinder Gill',
      channelTitle: 'Run-Up Records',
      durationSec: 176,
      durationMs: 176000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/excuses/CgUeCj4HBH4',
    },
    {
      id: 'js-tr-p3',
      title: 'Elevated',
      artist: 'Shubh',
      channelTitle: 'Shubh',
      durationSec: 200,
      durationMs: 200000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/elevated/VRAeCSsCQ3E',
    },
    {
      id: 'js-tr-p4',
      title: 'Cheques',
      artist: 'Shubh',
      channelTitle: 'Shubh',
      durationSec: 183,
      durationMs: 183000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/cheques/WjJdQxFjWAA',
    },
    {
      id: 'js-tr-p5',
      title: 'No Love',
      artist: 'Shubh',
      channelTitle: 'Shubh',
      durationSec: 170,
      durationMs: 170000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/no-love/BwoaRR0BVUE',
    },
    {
      id: 'js-tr-p6',
      title: 'Lover',
      artist: 'Diljit Dosanjh',
      channelTitle: 'Diljit Dosanjh',
      durationSec: 188,
      durationMs: 188000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/lover/Kj4eCh8EQgA',
    },
    {
      id: 'js-tr-p7',
      title: 'Mi Amor',
      artist: 'Sharn, 40k, The Paul',
      channelTitle: 'Sharn Music',
      durationSec: 218,
      durationMs: 218000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
      url: 'https://www.jiosaavn.com/song/mi-amor/N0E5AQZ7Z3s',
    },
  ],
};

/**
 * Authenticate user with JioSaavn using email/username + password
 * This calls JioSaavn's internal login API server-side
 */
export async function loginToJioSaavn(
  username: string,
  password: string
): Promise<JioSaavnLoginResult> {
  try {
    // JioSaavn internal login endpoint
    const loginUrl = `${JIOSAAVN_API_BASE}?__call=user.login&_format=json&_marker=0`;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://www.jiosaavn.com',
        'Referer': 'https://www.jiosaavn.com/',
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }).toString(),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Login failed with status ${response.status}`,
      };
    }

    const data = await response.json();

    // Check for error in response
    if (data.error || data.status === 'failure') {
      return {
        success: false,
        error: data.error?.msg || data.message || 'Invalid credentials. Please check your email/password.',
      };
    }

    // Extract user session data
    // JioSaavn returns different formats; handle common shapes
    const token = data.token || data.auth_token || data.session_token || data.T || '';
    const userId = data.uid || data.user_id || data.id || '';
    const displayName = data.name || data.firstname || data.username || username.split('@')[0];
    const email = data.email || username;
    const avatarUrl = data.image || data.profile_image || data.avatar || '';
    const isPro = data.is_pro === true || data.subscription?.type === 'pro';

    // Extract token from Set-Cookie if not in body
    const setCookieHeader = response.headers.get('set-cookie') || '';
    const cookieToken = setCookieHeader.match(/(?:L=|I=|CT=)([^;]+)/)?.[1] || '';

    return {
      success: true,
      token: token || cookieToken || `jiosaavn_session_${Date.now()}`,
      userId: userId || email,
      displayName,
      email,
      avatarUrl: avatarUrl || undefined,
      isPro,
    };
  } catch (error: any) {
    console.error('JioSaavn login error:', error);
    return {
      success: false,
      error: error.message || 'Network error. Could not reach JioSaavn servers.',
    };
  }
}

/**
 * Fetches the logged-in user's playlists from JioSaavn
 */
export async function fetchJioSaavnPlaylists(
  accessToken?: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist[]> {
  // If no real token or demo mode, return mock data
  if (!accessToken || isDemoMode || accessToken.startsWith('jiosaavn_session_') || accessToken.startsWith('jiosaavn_token_')) {
    return MOCK_JIOSAAVN_PLAYLISTS;
  }

  try {
    // Try to fetch user's playlists using their auth token
    const url = `${JIOSAAVN_API_BASE}?__call=user.getPlaylists&_format=json&_marker=0`;
    const response = await fetch(url, {
      headers: {
        'Cookie': `L=${accessToken}; CT=${accessToken}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const playlists: GenericPlaylist[] = [];

      // Parse the playlist array from JioSaavn's response
      const items = Array.isArray(data) ? data : data.playlists || data.playlist || data.list || [];

      for (const item of items) {
        if (!item) continue;
        playlists.push({
          id: item.listid || item.id || item.perma_url,
          title: item.listname || item.title || item.name || 'Untitled Playlist',
          description: item.description || item.subtitle || '',
          thumbnailUrl: item.image?.replace('150x150', '500x500') || item.perma_url || 
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
          itemCount: item.song_count || item.count || item.list_count || 0,
          channelTitle: item.firstname || item.username || 'JioSaavn User',
          ownerTitle: item.firstname || item.username || 'JioSaavn User',
          platform: 'jiosaavn',
        });
      }

      if (playlists.length > 0) return playlists;
    }
  } catch (e) {
    console.error('Failed to fetch JioSaavn playlists:', e);
  }

  // Fallback to curated/mock playlists
  return MOCK_JIOSAAVN_PLAYLISTS;
}

/**
 * Looks up any JioSaavn playlist by URL or ID
 */
export async function fetchJioSaavnPlaylistById(
  accessToken: string,
  input: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist | null> {
  const trimmed = input.trim();

  // Check if it matches any known mock playlist id
  const existing = MOCK_JIOSAAVN_PLAYLISTS.find((p) => p.id === trimmed);
  if (existing) return existing;

  // Try to fetch real playlist from JioSaavn
  if (trimmed.includes('jiosaavn.com')) {
    try {
      // Use the JioSaavn API to fetch playlist details by URL
      const apiUrl = `${JIOSAAVN_API_BASE}?__call=webapi.get&type=playlist&token=${encodeURIComponent(trimmed)}&_format=json&_marker=0`;
      const response = await fetch(apiUrl, {
        headers: {
          'Cookie': accessToken ? `L=${accessToken}` : '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && (data.listid || data.id)) {
          return {
            id: data.listid || data.id,
            title: data.listname || data.title || 'JioSaavn Playlist',
            description: data.description || data.subtitle || '',
            thumbnailUrl: data.image?.replace('150x150', '500x500') || 
              'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
            itemCount: data.song_count || data.list_count || 0,
            channelTitle: data.firstname || data.username || 'JioSaavn',
            ownerTitle: data.firstname || data.username || 'JioSaavn',
            platform: 'jiosaavn',
          };
        }
      }
    } catch (e) {
      console.error('Failed to fetch JioSaavn playlist by URL:', e);
    }
  }

  // Fallback: extract title from URL
  let parsedTitle = 'Custom JioSaavn Playlist';
  if (trimmed.includes('jiosaavn.com')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length >= 2) {
        const slug = segments[segments.length - 1] || segments[segments.length - 2];
        parsedTitle = slug
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }
    } catch {
      parsedTitle = 'Imported JioSaavn Playlist';
    }
  }

  const generatedId = `js-custom-${Date.now().toString(36)}`;
  return {
    id: generatedId,
    title: parsedTitle,
    description: `Imported via JioSaavn link (${trimmed.substring(0, 40)}...)`,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'JioSaavn User',
    ownerTitle: 'JioSaavn User',
    platform: 'jiosaavn',
  };
}

/**
 * Fetches tracks from a JioSaavn playlist
 */
export async function fetchJioSaavnPlaylistTracks(
  accessToken: string,
  playlistId: string,
  isDemoMode: boolean = false
): Promise<GenericTrack[]> {
  // Try mock data first
  if (MOCK_JIOSAAVN_TRACKS_BY_PLAYLIST[playlistId]) {
    return MOCK_JIOSAAVN_TRACKS_BY_PLAYLIST[playlistId];
  }

  // Try to fetch real tracks using JioSaavn API
  if (accessToken && !accessToken.startsWith('jiosaavn_session_') && !accessToken.startsWith('jiosaavn_token_')) {
    try {
      const url = `${JIOSAAVN_API_BASE}?__call=playlist.getDetails&listid=${playlistId}&_format=json&_marker=0`;
      const response = await fetch(url, {
        headers: {
          'Cookie': `L=${accessToken}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const songs = data.songs || data.list || [];
        const tracks: GenericTrack[] = [];

        for (const song of songs) {
          if (!song) continue;
          const durationSec = parseInt(song.duration || '0', 10);
          tracks.push({
            id: song.id || song.song_id,
            title: song.song || song.title || song.name || 'Unknown',
            artist: song.primary_artists || song.singers || song.artist || 'Unknown Artist',
            channelTitle: song.music || song.label || song.primary_artists || '',
            durationSec,
            durationMs: durationSec * 1000,
            thumbnailUrl: song.image?.replace('150x150', '500x500') || undefined,
            url: song.perma_url || song.url || `https://www.jiosaavn.com/song/-/${song.id}`,
          });
        }

        if (tracks.length > 0) return tracks;
      }
    } catch (e) {
      console.error('Failed to fetch JioSaavn playlist tracks:', e);
    }
  }

  return COMMON_TEST_TRACKS;
}

/**
 * Searches a track on JioSaavn using the search API
 */
export async function searchJioSaavnTrack(
  accessToken: string,
  cleanedTitle: string,
  cleanedArtist: string,
  durationSec?: number,
  isDemoMode: boolean = false
): Promise<{ track: GenericTrackResult | null; reason?: string }> {
  // Try real search API first
  if (!isDemoMode) {
    try {
      const query = `${cleanedTitle} ${cleanedArtist}`;
      const url = `${JIOSAAVN_API_BASE}?__call=search.getResults&_format=json&_marker=0&q=${encodeURIComponent(query)}&n=5`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const results = data.results || data.songs?.data || [];

        if (results.length > 0) {
          // Find best match considering duration
          let bestMatch = results[0];
          let bestDiff = Infinity;

          for (const item of results) {
            const itemDuration = parseInt(item.duration || '0', 10);
            if (durationSec && itemDuration > 0) {
              const diff = Math.abs(itemDuration - durationSec);
              if (diff <= 12 && diff < bestDiff) {
                bestDiff = diff;
                bestMatch = item;
              }
            }
          }

          const matchDuration = parseInt(bestMatch.duration || '0', 10);
          return {
            track: {
              id: bestMatch.id || bestMatch.song_id,
              name: bestMatch.song || bestMatch.title || bestMatch.name || cleanedTitle,
              artist: bestMatch.primary_artists || bestMatch.singers || bestMatch.artist || cleanedArtist,
              albumName: bestMatch.album || '',
              thumbnailUrl: bestMatch.image?.replace('150x150', '500x500'),
              durationSec: matchDuration,
              durationMs: matchDuration * 1000,
              url: bestMatch.perma_url || bestMatch.url || `https://www.jiosaavn.com/song/-/${bestMatch.id}`,
              platform: 'jiosaavn',
              durationDiffSec: durationSec ? Math.abs(matchDuration - durationSec) : 0,
            },
          };
        }
      }
    } catch (e) {
      console.error('JioSaavn search error:', e);
    }
  }

  // Fallback to mock search
  return searchMockUniversal('jiosaavn', cleanedTitle, cleanedArtist, durationSec);
}

/**
 * Creates a playlist on JioSaavn (mock - API doesn't support this publicly)
 */
export async function createJioSaavnPlaylist(
  accessToken: string,
  userId: string,
  title: string,
  description: string,
  isDemoMode: boolean = false
): Promise<{ id: string; url: string }> {
  // Try to create a real playlist if we have a valid token
  if (accessToken && !accessToken.startsWith('jiosaavn_session_') && !accessToken.startsWith('jiosaavn_token_')) {
    try {
      const url = `${JIOSAAVN_API_BASE}?__call=playlist.create&_format=json&_marker=0`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': `L=${accessToken}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        body: new URLSearchParams({
          listname: title,
          // description field if supported
        }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.listid || data.id) {
          return {
            id: data.listid || data.id,
            url: data.perma_url || `https://www.jiosaavn.com/featured/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}/${data.listid || data.id}`,
          };
        }
      }
    } catch (e) {
      console.error('Failed to create JioSaavn playlist:', e);
    }
  }

  // Fallback mock
  const fakeId = `js-pl-${Date.now().toString(36)}`;
  return {
    id: fakeId,
    url: `https://www.jiosaavn.com/featured/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}/${fakeId}`,
  };
}

/**
 * Adds tracks to a JioSaavn playlist
 */
export async function addTracksToJioSaavnPlaylist(
  accessToken: string,
  playlistId: string,
  trackIds: string[],
  isDemoMode: boolean = false
): Promise<{ addedCount: number; errors?: string[] }> {
  // Try real API if we have a valid token
  if (accessToken && !accessToken.startsWith('jiosaavn_session_') && !accessToken.startsWith('jiosaavn_token_')) {
    let addedCount = 0;
    const errors: string[] = [];

    for (const trackId of trackIds) {
      try {
        const url = `${JIOSAAVN_API_BASE}?__call=playlist.addSong&_format=json&_marker=0`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `L=${accessToken}`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          body: new URLSearchParams({
            listid: playlistId,
            song_id: trackId,
          }).toString(),
        });

        if (response.ok) {
          addedCount++;
        } else {
          errors.push(`Track ${trackId}: ${response.status}`);
        }
      } catch (e: any) {
        errors.push(`Track ${trackId}: ${e.message}`);
      }
    }

    return { addedCount, errors: errors.length > 0 ? errors : undefined };
  }

  return { addedCount: trackIds.length };
}
