import { CleanedTrackMetadata, SpotifyTrackResult } from './types';
import { buildSpotifySearchQueries, isDurationValid } from './normalization';
import { searchMockSpotify } from './mock-data';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/auth/spotify/callback';

export const SPOTIFY_SCOPES = [
  'playlist-read-private',
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
 * Searches Spotify for a track using strict query with fallback to broad query,
 * and validates candidate duration (within ±12s).
 */
export async function searchSpotifyTrack(
  accessToken: string,
  cleaned: CleanedTrackMetadata,
  isDemoMode: boolean = false
): Promise<{ track: SpotifyTrackResult | null; reason?: string }> {
  // If in Demo Mode, use the mock search engine
  if (isDemoMode || !accessToken || accessToken === 'demo_token') {
    return searchMockSpotify(cleaned.cleanedTitle, cleaned.cleanedArtist, cleaned.rawDurationSec);
  }

  const { strictQuery, fallbackQuery, broadQuery } = buildSpotifySearchQueries(cleaned);

  // Helper to execute Spotify search query
  const querySpotify = async (q: string) => {
    const url = `https://api.spotify.com/v1/search?type=track&limit=5&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.tracks?.items || [];
  };

  try {
    // 1. Primary Strict Search: track:X artist:Y
    let candidates = await querySpotify(strictQuery);

    // 2. Fallback Search: "Title Artist"
    if (!candidates || candidates.length === 0) {
      candidates = await querySpotify(fallbackQuery);
    }

    // 3. Broad Search: "Title"
    if (!candidates || candidates.length === 0) {
      candidates = await querySpotify(broadQuery);
    }

    if (!candidates || candidates.length === 0) {
      return {
        track: null,
        reason: `No results found on Spotify for "${cleaned.cleanedTitle}" by "${cleaned.cleanedArtist}"`,
      };
    }

    // 4. Duration Validation & Best Candidate Selection
    let bestMatch: any = null;
    let minDiffSec = Infinity;

    for (const item of candidates) {
      const durCheck = isDurationValid(item.duration_ms, cleaned.rawDurationSec, 12);
      if (durCheck.valid && durCheck.diffSec < minDiffSec) {
        minDiffSec = durCheck.diffSec;
        bestMatch = item;
      }
    }

    // If no candidate passed the strict ±12s check, check if first candidate is acceptable
    if (!bestMatch) {
      const first = candidates[0];
      const checkFirst = isDurationValid(first.duration_ms, cleaned.rawDurationSec, 12);
      if (cleaned.rawDurationSec && !checkFirst.valid) {
        return {
          track: null,
          reason: `Found "${first.name}" but duration mismatch (${Math.round(first.duration_ms / 1000)}s vs YouTube ${cleaned.rawDurationSec}s)`,
        };
      }
      bestMatch = first;
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

  // 1. Primary endpoint: POST /v1/me/playlists (Spotify modern standard)
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

  // 2. Fallback: try public: true if 403 (in case only playlist-modify-public was authorized)
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

  // 3. Fallback: try user endpoint
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

  // Sanitize: only valid spotify:track: URIs
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

    // 1. Spotify 2026 Modern Standard: POST /v1/playlists/{id}/items (JSON body)
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
        // 2. Fallback: POST /v1/playlists/{id}/items (Query params)
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
          // 3. Fallback: Legacy POST /v1/playlists/{id}/tracks
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
            // 4. Fallback: Legacy POST /v1/playlists/{id}/tracks (Query params)
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
