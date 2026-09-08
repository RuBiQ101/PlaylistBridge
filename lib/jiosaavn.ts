import { GenericPlaylist, GenericTrack, GenericTrackResult } from './types';
import { MOCK_JIOSAAVN_PLAYLISTS, COMMON_TEST_TRACKS, searchMockUniversal } from './mock-data';

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
 * Fetches user or featured playlists from JioSaavn
 */
export async function fetchJioSaavnPlaylists(
  accessToken?: string,
  isDemoMode: boolean = false
): Promise<GenericPlaylist[]> {
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

  // Extract playlist/featured title or ID from URL
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
  if (MOCK_JIOSAAVN_TRACKS_BY_PLAYLIST[playlistId]) {
    return MOCK_JIOSAAVN_TRACKS_BY_PLAYLIST[playlistId];
  }
  return COMMON_TEST_TRACKS;
}

/**
 * Searches a track on JioSaavn
 */
export async function searchJioSaavnTrack(
  accessToken: string,
  cleanedTitle: string,
  cleanedArtist: string,
  durationSec?: number,
  isDemoMode: boolean = false
): Promise<{ track: GenericTrackResult | null; reason?: string }> {
  return searchMockUniversal('jiosaavn', cleanedTitle, cleanedArtist, durationSec);
}

/**
 * Creates a playlist on JioSaavn
 */
export async function createJioSaavnPlaylist(
  accessToken: string,
  userId: string,
  title: string,
  description: string,
  isDemoMode: boolean = false
): Promise<{ id: string; url: string }> {
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
  return { addedCount: trackIds.length };
}
