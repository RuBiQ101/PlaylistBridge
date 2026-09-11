import { CleanedTrackMetadata, GenericPlaylist, GenericTrack, SpotifyTrackResult } from './types';
import { buildSpotifySearchQueries, isDurationValid } from './normalization';
import { searchMockSpotify, MOCK_SPOTIFY_PLAYLISTS, MOCK_SPOTIFY_PLAYLIST_TRACKS } from './mock-data';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/spotify/callback';

export const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-modify',
  'user-read-private',
].join(' ');

/**
 * Generates Spotify OAuth authorization URL
 */
export function getSpotifyAuthUrl(customRedirectUri?: string, state: string = 'spotify_auth'): string {
  const redirectUri =
    customRedirectUri || SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/spotify/callback';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    show_dialog: 'true',
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

/**
 * Exchanges authorization code for Spotify tokens
 */
export async function exchangeSpotifyCode(code: string, customRedirectUri?: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const redirectUri =
    customRedirectUri || SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/spotify/callback';
  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Spotify token exchange failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refreshes an expired Spotify access token using the refresh token
 */
export async function refreshSpotifyAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Spotify token refresh failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in,
  };
}

/**
 * Gets the current Spotify user's profile
 */
export async function getSpotifyUserProfile(accessToken: string): Promise<{
  id: string;
  displayName: string;
  avatarUrl?: string;
}> {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Spotify profile: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    displayName: data.display_name || data.id,
    avatarUrl: data.images?.[0]?.url,
  };
}

/**
 * Fetches user playlists from Spotify API including Liked Songs
 */
export async function fetchUserSpotifyPlaylists(
  accessToken: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist[]> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return MOCK_SPOTIFY_PLAYLISTS;
  }

  let playlists: GenericPlaylist[] = [];

  // 1. Try to fetch Liked Songs (user library)
  try {
    const likedRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=1', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (likedRes.ok) {
      const likedData = await likedRes.json();
      playlists.push({
        id: 'LIKED_SONGS',
        title: 'Liked Songs',
        description: 'Your saved library tracks on Spotify (Auto playlist)',
        thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        itemCount: likedData.total || 0,
        channelTitle: 'Spotify Auto Library',
        ownerTitle: 'You',
        platform: 'spotify',
      });
    }
  } catch (e) {
    // ignore
  }

  // 2. Fetch user's playlists with pagination
  let offset = 0;
  const limit = 50;
  let hasNext = true;

  while (hasNext && playlists.length < 200) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) break;

      const data = await res.json();
      const items = data.items || [];

      for (const item of items) {
        if (!item) continue;
        playlists.push({
          id: item.id,
          title: item.name || 'Untitled Spotify Playlist',
          description: item.description || '',
          thumbnailUrl:
            item.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          itemCount: item.tracks?.total || 0,
          channelTitle: item.owner?.display_name || 'Spotify User',
          ownerTitle: item.owner?.display_name || 'Spotify User',
          platform: 'spotify',
        });
      }

      if (data.next) {
        offset += limit;
      } else {
        hasNext = false;
      }
    } catch (e) {
      break;
    }
  }

  return playlists;
}

/**
 * Looks up any Spotify playlist by URL, URI, or ID
 */
export async function fetchSpotifyPlaylistById(
  accessToken: string,
  input: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist | null> {
  let playlistId = input.trim();

  // Extract ID from URL (e.g. open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...)
  if (playlistId.includes('spotify.com/playlist/')) {
    const match = playlistId.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      playlistId = match[1];
    }
  } else if (playlistId.startsWith('spotify:playlist:')) {
    playlistId = playlistId.replace('spotify:playlist:', '');
  }

  if (isDemoMode) {
    return (
      MOCK_SPOTIFY_PLAYLISTS.find((p) => p.id === playlistId) || {
        id: playlistId,
        title: `Custom Spotify Playlist (${playlistId})`,
        description: 'Imported via URL',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        itemCount: 8,
        channelTitle: 'Spotify Curated',
        platform: 'spotify',
      }
    );
  }

  try {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;

    const item = await res.json();
    return {
      id: item.id,
      title: item.name || 'Custom Spotify Playlist',
      description: item.description || '',
      thumbnailUrl:
        item.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      itemCount: item.tracks?.total || 0,
      channelTitle: item.owner?.display_name || 'Spotify',
      ownerTitle: item.owner?.display_name || 'Spotify',
      platform: 'spotify',
    };
  } catch (e) {
    return null;
  }
}

/**
 * Fetches all tracks from a selected Spotify playlist or Liked Songs
 */
export async function fetchSpotifyPlaylistTracks(
  accessToken: string,
  playlistId: string,
  isDemoMode: boolean = false
): Promise<GenericTrack[]> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return MOCK_SPOTIFY_PLAYLIST_TRACKS[playlistId] || MOCK_SPOTIFY_PLAYLIST_TRACKS['LIKED_SONGS'] || [];
  }

  const tracks: GenericTrack[] = [];

  // If Liked Songs
  if (playlistId === 'LIKED_SONGS') {
    let offset = 0;
    const limit = 50;
    let hasNext = true;

    while (hasNext && tracks.length < 500) {
      const res = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) break;

      const data = await res.json();
      const items = data.items || [];

      for (const item of items) {
        const t = item.track;
        if (!t || !t.id) continue;
        tracks.push({
          id: t.id,
          title: t.name,
          artist: t.artists?.[0]?.name || 'Unknown Artist',
          channelTitle: t.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
          durationMs: t.duration_ms,
          durationSec: Math.round(t.duration_ms / 1000),
          thumbnailUrl: t.album?.images?.[0]?.url,
          uri: t.uri,
          url: t.external_urls?.spotify,
        });
      }

      if (data.next) {
        offset += limit;
      } else {
        hasNext = false;
      }
    }

    return tracks;
  }

  // Otherwise regular playlist
  let fetchUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

  while (fetchUrl && tracks.length < 500) {
    const response: Response = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) break;

    const data: any = await response.json();
    const items = data.items || [];

    for (const item of items) {
      const t = item.track;
      if (!t || !t.id) continue;
      tracks.push({
        id: t.id,
        title: t.name,
        artist: t.artists?.[0]?.name || 'Unknown Artist',
        channelTitle: t.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
        durationMs: t.duration_ms,
        durationSec: Math.round(t.duration_ms / 1000),
        thumbnailUrl: t.album?.images?.[0]?.url,
        uri: t.uri,
        url: t.external_urls?.spotify,
      });
    }

    fetchUrl = data.next || null;
  }

  return tracks;
}

/**
 * Searches Spotify for a track using strict query with fallback to broad query,
 * and validates candidate duration (within ±12s).
 */
export async function searchSpotifyTrack(
  accessToken: string,
  cleaned: CleanedTrackMetadata,
  isDemoMode: boolean = false
): Promise<{ track: SpotifyTrackResult | null; reason?: string }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return searchMockSpotify(cleaned.cleanedTitle, cleaned.cleanedArtist, cleaned.rawDurationSec);
  }

  const { strictQuery, fallbackQuery, broadQuery, alternateQueries } = buildSpotifySearchQueries(cleaned);

  const querySpotify = async (q: string): Promise<any[]> => {
    if (!q || q.trim().length < 2) return [];
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const url = `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 429) {
          const retryHeader = res.headers.get('Retry-After');
          const waitSec = retryHeader ? Math.max(parseInt(retryHeader, 10), 1) : 2;
          console.warn(`[Spotify Rate Limit 429] Waiting ${waitSec}s before retrying query: "${q}"...`);
          await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
          continue;
        }

        if (res.status === 401) {
          console.error('[Spotify Auth 401] Access token expired or invalid');
          return [];
        }

        if (!res.ok) return [];
        const json = await res.json();
        return json.tracks?.items || [];
      } catch {
        if (attempt === 2) return [];
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    return [];
  };

  try {
    let candidates = await querySpotify(strictQuery);

    if (!candidates || candidates.length === 0) {
      candidates = await querySpotify(fallbackQuery);
    }

    if (!candidates || candidates.length === 0) {
      candidates = await querySpotify(broadQuery);
    }

    // Try alternate queries if multilingual (e.g. Romanized Hindi part)
    if ((!candidates || candidates.length === 0) && alternateQueries) {
      for (const altQuery of alternateQueries) {
        candidates = await querySpotify(altQuery);
        if (candidates && candidates.length > 0) break;
      }
    }

    if (!candidates || candidates.length === 0) {
      return {
        track: null,
        reason: `No results found on Spotify for "${cleaned.cleanedTitle}" by "${cleaned.cleanedArtist}"`,
      };
    }

    // Find best match: prioritize duration if within 30 seconds, otherwise take best candidate
    let bestMatch: any = null;
    let minDiffSec = Infinity;

    for (const item of candidates) {
      const durCheck = isDurationValid(item.duration_ms, cleaned.rawDurationSec, 35);
      if (durCheck.valid && durCheck.diffSec < minDiffSec) {
        minDiffSec = durCheck.diffSec;
        bestMatch = item;
      }
    }

    // If no candidate was within ±35s (common with music videos that have long skits/intros),
    // still use the top relevant candidate from Spotify instead of failing the track
    if (!bestMatch) {
      bestMatch = candidates[0];
    }

    const result: SpotifyTrackResult = {
      id: bestMatch.id,
      name: bestMatch.name,
      artist: bestMatch.artists?.[0]?.name || 'Unknown',
      artists: bestMatch.artists?.map((a: any) => a.name) || [],
      albumName: bestMatch.album?.name || '',
      albumImageUrl: bestMatch.album?.images?.[0]?.url,
      uri: bestMatch.uri,
      durationMs: bestMatch.duration_ms,
      durationSec: Math.round(bestMatch.duration_ms / 1000),
      spotifyUrl: bestMatch.external_urls?.spotify || `https://open.spotify.com/track/${bestMatch.id}`,
      durationDiffSec: cleaned.rawDurationSec
        ? Math.round(Math.abs(bestMatch.duration_ms / 1000 - cleaned.rawDurationSec))
        : 0,
    };

    return { track: result };
  } catch (error: any) {
    return {
      track: null,
      reason: `Spotify search error: ${error.message || 'Unknown network error'}`,
    };
  }
}

/**
 * Creates a new playlist on Spotify for the user
 */
export async function createSpotifyPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string = 'Migrated from YouTube Music using PlaylistBridge',
  isDemoMode: boolean = false
): Promise<{ id: string; url: string }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    const fakeId = `mock-sp-pl-${Date.now()}`;
    return {
      id: fakeId,
      url: `https://open.spotify.com/playlist/${fakeId}`,
    };
  }

  let response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: false,
    }),
  });

  if (!response.ok && response.status === 403) {
    response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        public: true,
      }),
    });
  }

  if (!response.ok && userId && userId !== 'demo_user') {
    response = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });
  }

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create Spotify playlist: ${response.status} ${err}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    url: data.external_urls?.spotify || `https://open.spotify.com/playlist/${data.id}`,
  };
}

/**
 * Adds tracks to a Spotify playlist in batches with modern /items endpoint and /tracks fallback
 */
export async function addTracksToSpotifyPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[],
  isDemoMode: boolean = false
): Promise<{ addedCount: number; errors?: string[] }> {
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return { addedCount: trackUris.length };
  }

  const validUris = trackUris.filter(
    (uri) => uri && typeof uri === 'string' && uri.startsWith('spotify:track:')
  );

  if (validUris.length === 0) return { addedCount: 0 };

  const chunkSize = 50;
  let totalAdded = 0;
  const errors: string[] = [];

  for (let i = 0; i < validUris.length; i += chunkSize) {
    const chunk = validUris.slice(i, i + chunkSize);
    let chunkSuccess = false;

    try {
      let response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: chunk,
        }),
      });

      if (response.ok) {
        chunkSuccess = true;
        totalAdded += chunk.length;
      } else {
        const queryUris = encodeURIComponent(chunk.join(','));
        response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items?uris=${queryUris}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          chunkSuccess = true;
          totalAdded += chunk.length;
        } else {
          response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uris: chunk,
            }),
          });

          if (response.ok) {
            chunkSuccess = true;
            totalAdded += chunk.length;
          } else {
            response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${queryUris}`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              chunkSuccess = true;
              totalAdded += chunk.length;
            } else {
              const errText = await response.text();
              console.warn(`Spotify addTracks chunk error (${response.status}): ${errText}`);
              errors.push(`Chunk ${Math.floor(i / chunkSize) + 1}: ${response.status} ${errText}`);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`Failed adding chunk ${i}:`, e.message);
      errors.push(`Chunk ${Math.floor(i / chunkSize) + 1}: ${e.message}`);
    }
  }

  return { addedCount: totalAdded, errors };
}
