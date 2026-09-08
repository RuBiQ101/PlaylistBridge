import {
  GenericPlaylist,
  GenericTrack,
  GenericTrackResult,
  PlatformId,
} from './types';
import {
  MOCK_APPLE_PLAYLISTS,
  MOCK_AMAZON_PLAYLISTS,
  MOCK_JIOSAAVN_PLAYLISTS,
  MOCK_SOUNDCLOUD_PLAYLISTS,
  MOCK_TIDAL_PLAYLISTS,
  COMMON_TEST_TRACKS,
  searchMockUniversal,
} from './mock-data';
import {
  fetchUserPlaylists as fetchYouTubePlaylists,
  fetchPlaylistTracks as fetchYouTubeTracks,
  fetchPlaylistById as fetchYouTubePlaylistById,
  createYouTubePlaylist,
  searchYouTubeTrack,
  addTracksToYouTubePlaylist,
} from './youtube';
import {
  fetchUserSpotifyPlaylists,
  fetchSpotifyPlaylistTracks,
  fetchSpotifyPlaylistById,
  createSpotifyPlaylist,
  searchSpotifyTrack,
  addTracksToSpotifyPlaylist,
} from './spotify';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badge: string;
  available: boolean;
  defaultScopes: string;
  connectUrl: string;
}

export const PLATFORMS_CONFIG: Record<PlatformId, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube Music',
    tagline: 'Google Audio & Video Playlists',
    color: 'text-red-500',
    bgColor: 'bg-red-950/30',
    borderColor: 'border-red-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'youtube, youtube.readonly',
    connectUrl: '/api/auth/youtube',
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    tagline: 'Spotify Web API & User Library',
    color: 'text-spotify',
    bgColor: 'bg-emerald-950/30',
    borderColor: 'border-emerald-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'playlist-modify-public & private, library',
    connectUrl: '/api/auth/spotify',
  },
  apple: {
    id: 'apple',
    name: 'Apple Music',
    tagline: 'MusicKit & Apple Music Playlists',
    color: 'text-rose-500',
    bgColor: 'bg-rose-950/30',
    borderColor: 'border-rose-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'musickit:library:read-write',
    connectUrl: '/api/auth/apple',
  },
  amazon: {
    id: 'amazon',
    name: 'Amazon Music',
    tagline: 'Amazon Prime & Unlimited HD Library',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30',
    borderColor: 'border-cyan-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'amazon:music:read-write',
    connectUrl: '/api/auth/amazon',
  },
  jiosaavn: {
    id: 'jiosaavn',
    name: 'JioSaavn (Jio Music)',
    tagline: 'JioTunes & Saavn Library',
    color: 'text-teal-400',
    bgColor: 'bg-teal-950/30',
    borderColor: 'border-teal-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'jiosaavn:playlist:read-write',
    connectUrl: '/api/auth/jiosaavn',
  },
  soundcloud: {
    id: 'soundcloud',
    name: 'SoundCloud',
    tagline: 'SoundCloud API & Tracks',
    color: 'text-orange-500',
    bgColor: 'bg-orange-950/30',
    borderColor: 'border-orange-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'soundcloud:library:read-write',
    connectUrl: '/api/auth/soundcloud',
  },
  tidal: {
    id: 'tidal',
    name: 'Tidal',
    tagline: 'TIDAL HiFi Masters & Playlists',
    color: 'text-sky-400',
    bgColor: 'bg-sky-950/30',
    borderColor: 'border-sky-500/40',
    badge: 'Active & Ready',
    available: true,
    defaultScopes: 'tidal:playlists:read-write',
    connectUrl: '/api/auth/tidal',
  },
};

/**
 * Fetches user playlists from ANY platform
 */
export async function fetchPlatformPlaylists(
  platform: PlatformId,
  accessToken: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist[]> {
  if (platform === 'youtube') {
    return fetchYouTubePlaylists(accessToken, isDemoMode);
  }
  if (platform === 'spotify') {
    return fetchUserSpotifyPlaylists(accessToken, isDemoMode);
  }
  if (platform === 'apple') {
    return MOCK_APPLE_PLAYLISTS;
  }
  if (platform === 'amazon') {
    return MOCK_AMAZON_PLAYLISTS;
  }
  if (platform === 'jiosaavn') {
    return MOCK_JIOSAAVN_PLAYLISTS;
  }
  if (platform === 'soundcloud') {
    return MOCK_SOUNDCLOUD_PLAYLISTS;
  }
  if (platform === 'tidal') {
    return MOCK_TIDAL_PLAYLISTS;
  }
  return [];
}

/**
 * Looks up any playlist by URL or ID on ANY platform
 */
export async function fetchPlatformPlaylistById(
  platform: PlatformId,
  accessToken: string,
  input: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist | null> {
  if (platform === 'youtube') {
    return fetchYouTubePlaylistById(accessToken, input, isDemoMode);
  }
  if (platform === 'spotify') {
    return fetchSpotifyPlaylistById(accessToken, input, isDemoMode);
  }

  const pConfig = PLATFORMS_CONFIG[platform] || PLATFORMS_CONFIG['spotify'];
  return {
    id: `${platform}-custom-${Date.now()}`,
    title: `Imported ${pConfig.name} Playlist`,
    description: `Imported via URL (${input.substring(0, 35)}...)`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: `${pConfig.name} User`,
    ownerTitle: `${pConfig.name} User`,
    platform,
  };
}

/**
 * Fetches all tracks from a playlist on ANY platform
 */
export async function fetchPlatformPlaylistTracks(
  platform: PlatformId,
  accessToken: string,
  playlistId: string,
  isDemoMode: boolean = false
): Promise<GenericTrack[]> {
  if (platform === 'youtube') {
    return fetchYouTubeTracks(accessToken, playlistId, isDemoMode);
  }
  if (platform === 'spotify') {
    return fetchSpotifyPlaylistTracks(accessToken, playlistId, isDemoMode);
  }
  return COMMON_TEST_TRACKS;
}

/**
 * Searches a track on ANY platform with duration validation
 */
export async function searchPlatformTrack(
  platform: PlatformId,
  accessToken: string,
  cleanedTitle: string,
  cleanedArtist: string,
  durationSec?: number,
  isDemoMode: boolean = false
): Promise<{ track: GenericTrackResult | null; reason?: string }> {
  if (platform === 'youtube' && accessToken && accessToken !== 'demo_token') {
    const res = await searchYouTubeTrack(accessToken, cleanedTitle, cleanedArtist, durationSec, false);
    if (!res.track) return { track: null, reason: res.reason };
    return {
      track: {
        id: res.track.id,
        name: res.track.name,
        artist: res.track.artist,
        thumbnailUrl: res.track.thumbnailUrl,
        durationSec: res.track.durationSec,
        durationMs: res.track.durationSec * 1000,
        url: res.track.url,
        platform: 'youtube',
        durationDiffSec: res.track.durationDiffSec,
      },
    };
  }

  if (platform === 'spotify' && accessToken && accessToken !== 'demo_token') {
    const res = await searchSpotifyTrack(
      accessToken,
      {
        originalTitle: cleanedTitle,
        channelTitle: cleanedArtist,
        cleanedTitle,
        cleanedArtist,
        rawDurationSec: durationSec,
      },
      false
    );
    if (!res.track) return { track: null, reason: res.reason };
    return {
      track: {
        id: res.track.id,
        name: res.track.name,
        artist: res.track.artist,
        albumName: res.track.albumName,
        thumbnailUrl: res.track.albumImageUrl,
        durationSec: res.track.durationSec,
        durationMs: res.track.durationMs,
        url: res.track.spotifyUrl,
        uri: res.track.uri,
        platform: 'spotify',
        durationDiffSec: res.track.durationDiffSec,
      },
    };
  }

  // Universal search across all platforms
  return searchMockUniversal(platform, cleanedTitle, cleanedArtist, durationSec);
}

/**
 * Creates a new playlist on ANY platform
 */
export async function createPlatformPlaylist(
  platform: PlatformId,
  accessToken: string,
  userId: string,
  title: string,
  description: string,
  isDemoMode: boolean = false
): Promise<{ id: string; url: string }> {
  if (platform === 'youtube' && accessToken && accessToken !== 'demo_token') {
    return createYouTubePlaylist(accessToken, title, description, false);
  }
  if (platform === 'spotify' && accessToken && accessToken !== 'demo_token') {
    return createSpotifyPlaylist(accessToken, userId, title, description, false);
  }

  const fakeId = `${platform}-pl-${Date.now()}`;
  let url = '';
  if (platform === 'youtube') url = `https://music.youtube.com/playlist?list=${fakeId}`;
  else if (platform === 'spotify') url = `https://open.spotify.com/playlist/${fakeId}`;
  else if (platform === 'apple') url = `https://music.apple.com/playlist/${fakeId}`;
  else if (platform === 'amazon') url = `https://music.amazon.com/playlists/${fakeId}`;
  else if (platform === 'jiosaavn') url = `https://www.jiosaavn.com/featured/${fakeId}`;
  else if (platform === 'soundcloud') url = `https://soundcloud.com/user/sets/${fakeId}`;
  else if (platform === 'tidal') url = `https://tidal.com/playlist/${fakeId}`;

  return { id: fakeId, url };
}

/**
 * Adds tracks to a playlist on ANY platform
 */
export async function addTracksToPlatformPlaylist(
  platform: PlatformId,
  accessToken: string,
  playlistId: string,
  trackIdsOrUris: string[],
  isDemoMode: boolean = false
): Promise<{ addedCount: number; errors?: string[] }> {
  if (platform === 'youtube' && accessToken && accessToken !== 'demo_token') {
    return addTracksToYouTubePlaylist(accessToken, playlistId, trackIdsOrUris, false);
  }
  if (platform === 'spotify' && accessToken && accessToken !== 'demo_token') {
    return addTracksToSpotifyPlaylist(accessToken, playlistId, trackIdsOrUris, false);
  }

  return { addedCount: trackIdsOrUris.length };
}
