import {
  GenericPlaylist,
  GenericTrack,
  PlatformId,
  SpotifyTrackResult,
  YouTubeTrackResult,
  GenericTrackResult,
} from './types';

// ======================= YOUTUBE MUSIC =======================
export const MOCK_YOUTUBE_PLAYLISTS: GenericPlaylist[] = [
  {
    id: 'yt-pl-synthwave-80s',
    title: 'Neon Nights: Synthwave & Retro Electro',
    description: 'Vibrant 80s outrun synthwave and electronic highway vibes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'RetroWaves Studio',
    platform: 'youtube',
  },
  {
    id: 'yt-pl-lofi-chill',
    title: 'Late Night Lo-Fi Beats & Study Coffee',
    description: 'Chill instrumental beats to study, relax, and code to.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    itemCount: 6,
    channelTitle: 'Chilled Cow & Beat Lab',
    platform: 'youtube',
  },
  {
    id: 'yt-pl-rock-legends',
    title: 'Ultimate 90s & 2000s Alt Rock Anthems',
    description: 'Classic rock, indie gems, and high-energy guitar tracks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    itemCount: 7,
    channelTitle: 'Rock Vault Official',
    platform: 'youtube',
  },
];

export const MOCK_YOUTUBE_TRACKS: Record<string, GenericTrack[]> = {
  'yt-pl-synthwave-80s': [
    {
      id: 'yt-tr-1',
      title: 'The Weeknd - Blinding Lights (Official Music Video)',
      channelTitle: 'TheWeekndVEVO',
      durationSec: 260,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-2',
      title: 'Daft Punk ft. Pharrell Williams - Get Lucky [HD Audio]',
      channelTitle: 'Daft Punk - Topic',
      durationSec: 248,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-3',
      title: 'Midnight City by M83 (Official 4K Remastered)',
      channelTitle: 'M83 Official',
      durationSec: 243,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-4',
      title: 'Kavinsky - Nightcall [Original Mix - Drive Soundtrack]',
      channelTitle: 'Kavinsky Official',
      durationSec: 259,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-5',
      title: 'Starboy (feat. Daft Punk) - The Weeknd (Lyric Video)',
      channelTitle: 'The Weeknd',
      durationSec: 230,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-6',
      title: 'Carpenter Brut - Turbo Killer (Official Video)',
      channelTitle: 'Carpenter Brut - Topic',
      durationSec: 208,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-7',
      title: 'Gunship - Tech Noir (feat. John Carpenter)',
      channelTitle: 'GUNSHIP Music',
      durationSec: 297,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-tr-8',
      title: 'Unknown Underground Vaporwave Track - Ultra Rare Live Demo [Unreleased 1989 Bootleg]',
      channelTitle: 'MysticTapeHoarder99',
      durationSec: 512,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300&auto=format&fit=crop&q=80',
    },
  ],
  'yt-pl-lofi-chill': [
    {
      id: 'yt-lf-1',
      title: 'Kudasai - A Light of Mine [Lofi Hip Hop Audio]',
      channelTitle: 'ChillHop Music',
      durationSec: 142,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-lf-2',
      title: 'Idealism - Both of Us (Visualizer)',
      channelTitle: 'Idealism - Topic',
      durationSec: 154,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-lf-3',
      title: 'Jinsang - Affection (Official Audio)',
      channelTitle: 'Jinsang Beats',
      durationSec: 130,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-lf-4',
      title: 'Tomppabeats - Monday Loop (HQ)',
      channelTitle: 'Tomppabeats',
      durationSec: 98,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-lf-5',
      title: 'Nujabes - Feather feat. Cise Starr & Akin [Classic Edition]',
      channelTitle: 'Hydeout Productions',
      durationSec: 175,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-lf-6',
      title: 'Obscure Fan-Made Cafe Ambiance Loop - 24 Hours [Audio Track]',
      channelTitle: 'RandomNoiseChannel',
      durationSec: 86400,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    },
  ],
  'yt-pl-rock-legends': [
    {
      id: 'yt-rk-1',
      title: 'Queen - Bohemian Rhapsody (2011 Remaster) [Official Video]',
      channelTitle: 'Queen Official',
      durationSec: 355,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-2',
      title: 'Nirvana - Smells Like Teen Spirit (Official Music Video)',
      channelTitle: 'NirvanaVEVO',
      durationSec: 301,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-3',
      title: 'Foo Fighters - Everlong (Official HD Video)',
      channelTitle: 'Foo Fighters',
      durationSec: 250,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-4',
      title: 'The Killers - Mr. Brightside (Official Music Video)',
      channelTitle: 'TheKillersVEVO',
      durationSec: 228,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-5',
      title: 'Arctic Monkeys - Do I Wanna Know? (Official Video)',
      channelTitle: 'ArcticMonkeysVEVO',
      durationSec: 272,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-6',
      title: 'Red Hot Chili Peppers - Californication [Official Music Video]',
      channelTitle: 'Red Hot Chili Peppers',
      durationSec: 321,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'yt-rk-7',
      title: 'Radiohead - Creep (HD Audio Video)',
      channelTitle: 'Radiohead',
      durationSec: 236,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
    },
  ],
};

// ======================= SPOTIFY =======================
export const MOCK_SPOTIFY_PLAYLISTS: GenericPlaylist[] = [
  {
    id: 'LIKED_SONGS',
    title: 'Liked Songs',
    description: 'Your favorite tracks on Spotify (Auto Library)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'Spotify Auto Library',
    ownerTitle: 'Spotify User',
    platform: 'spotify',
  },
  {
    id: 'sp-pl-synth-hits',
    title: 'Neon Nights: Synthwave & Retro Electro',
    description: 'Vibrant 80s outrun synthwave and electronic highway vibes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'Curated by Spotify',
    ownerTitle: 'Spotify User',
    platform: 'spotify',
  },
  {
    id: 'sp-pl-rock-classics',
    title: 'Ultimate 90s & 2000s Alt Rock Anthems',
    description: 'Classic rock, indie gems, and high-energy guitar tracks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    itemCount: 7,
    channelTitle: 'Rock Classics Hub',
    ownerTitle: 'Spotify User',
    platform: 'spotify',
  },
  {
    id: 'sp-pl-chill-beats',
    title: 'Late Night Lo-Fi Beats & Study Coffee',
    description: 'Chill instrumental beats to study, relax, and code to.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    itemCount: 6,
    channelTitle: 'Lo-Fi Chillout',
    ownerTitle: 'Spotify User',
    platform: 'spotify',
  },
];

export const MOCK_SPOTIFY_PLAYLIST_TRACKS: Record<string, GenericTrack[]> = {
  LIKED_SONGS: [
    {
      id: 'sp-1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      durationSec: 200,
      durationMs: 200040,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
    },
    {
      id: 'sp-2',
      title: 'Get Lucky (feat. Pharrell Williams)',
      artist: 'Daft Punk',
      durationSec: 248,
      durationMs: 248413,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:69kOkLUCkxIZYexIgSG8rq',
    },
    {
      id: 'sp-3',
      title: 'Midnight City',
      artist: 'M83',
      durationSec: 243,
      durationMs: 243266,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:6GyFP1nfCDB8Jyik978UXW',
    },
    {
      id: 'sp-4',
      title: 'Nightcall',
      artist: 'Kavinsky',
      durationSec: 259,
      durationMs: 259346,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:0u0W5BKyAhQ66487WjG9jH',
    },
    {
      id: 'sp-5',
      title: 'Starboy',
      artist: 'The Weeknd',
      durationSec: 230,
      durationMs: 230453,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:7MXVkk9YM5IZxh0vL21tK2',
    },
    {
      id: 'sp-6',
      title: 'Turbo Killer',
      artist: 'Carpenter Brut',
      durationSec: 208,
      durationMs: 208466,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:10qbHF9200A5RIpZ3xV96o',
    },
    {
      id: 'sp-7',
      title: 'Tech Noir',
      artist: 'GUNSHIP',
      durationSec: 297,
      durationMs: 297293,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:27NeeG23Yy2wB6960vHk2M',
    },
  ],
};

// ======================= AMAZON MUSIC =======================
export const MOCK_AMAZON_PLAYLISTS: GenericPlaylist[] = [
  {
    id: 'az-pl-all-hits',
    title: 'All Hits HD: Amazon Prime Selection',
    description: 'Ultra HD streaming favorites and top trending global chartbusters.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'Amazon Music Originals',
    ownerTitle: 'Amazon Music',
    platform: 'amazon',
  },
  {
    id: 'az-pl-lofi-station',
    title: 'Focus & Study: Ambient Lo-Fi Beats',
    description: 'Instrumental relaxation and study audio in Ultra HD.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    itemCount: 6,
    channelTitle: 'Amazon Music Focus',
    ownerTitle: 'Amazon Music',
    platform: 'amazon',
  },
];

// ======================= JIOSAAVN (JIO MUSIC) =======================
export const MOCK_JIOSAAVN_PLAYLISTS: GenericPlaylist[] = [
  {
    id: 'js-pl-top-jiotunes',
    title: 'JioTunes Top Trending Hits',
    description: 'Most loved chartbusters, Bollywood party tracks & international hits.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'JioSaavn Editorial',
    ownerTitle: 'JioSaavn',
    platform: 'jiosaavn',
  },
  {
    id: 'js-pl-punjabi-desi',
    title: 'Desi Beats & International Wave',
    description: 'High octane fusion beats, pop melodies, and synth vibes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    itemCount: 7,
    channelTitle: 'JioSaavn Pop',
    ownerTitle: 'JioSaavn',
    platform: 'jiosaavn',
  },
];

// ======================= TIDAL =======================
export const MOCK_TIDAL_PLAYLISTS: GenericPlaylist[] = [
  {
    id: 'td-pl-master-audio',
    title: 'TIDAL HiFi Max Masters',
    description: 'Lossless Master Quality Authenticated (MQA) audio tracks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    itemCount: 8,
    channelTitle: 'TIDAL HiFi Masters',
    ownerTitle: 'TIDAL',
    platform: 'tidal',
  },
];

// Master Map of tracks across all platforms
export const COMMON_TEST_TRACKS: GenericTrack[] = [
  {
    id: 'tr-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    durationSec: 200,
    durationMs: 200040,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-2',
    title: 'Get Lucky',
    artist: 'Daft Punk',
    durationSec: 248,
    durationMs: 248413,
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-3',
    title: 'Midnight City',
    artist: 'M83',
    durationSec: 243,
    durationMs: 243266,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-4',
    title: 'Nightcall',
    artist: 'Kavinsky',
    durationSec: 259,
    durationMs: 259346,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-5',
    title: 'Starboy',
    artist: 'The Weeknd',
    durationSec: 230,
    durationMs: 230453,
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-6',
    title: 'Turbo Killer',
    artist: 'Carpenter Brut',
    durationSec: 208,
    durationMs: 208466,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'tr-7',
    title: 'Tech Noir',
    artist: 'GUNSHIP',
    durationSec: 297,
    durationMs: 297293,
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
  },
];

/**
 * Universal Track Search across ANY platform
 */
export function searchMockUniversal(
  targetPlatform: PlatformId,
  cleanedTitle: string,
  cleanedArtist: string,
  sourceDurationSec?: number
): { track: GenericTrackResult | null; reason?: string } {
  const normTitle = cleanedTitle.toLowerCase().trim();
  const normArtist = cleanedArtist.toLowerCase().trim();

  // Find in common test tracks
  for (const item of COMMON_TEST_TRACKS) {
    const itemTitle = item.title.toLowerCase();
    const itemArtist = (item.artist || '').toLowerCase();

    if (itemTitle.includes(normTitle) || normTitle.includes(itemTitle)) {
      const matchArtist =
        itemArtist.includes(normArtist) || normArtist.includes(itemArtist);

      if (matchArtist || !normArtist) {
        let platformUrl = '';
        if (targetPlatform === 'spotify') platformUrl = `https://open.spotify.com/track/${item.id}`;
        else if (targetPlatform === 'youtube') platformUrl = `https://music.youtube.com/watch?v=${item.id}`;
        else if (targetPlatform === 'amazon') platformUrl = `https://music.amazon.com/tracks/${item.id}`;
        else if (targetPlatform === 'jiosaavn') platformUrl = `https://www.jiosaavn.com/song/${item.id}`;
        else if (targetPlatform === 'tidal') platformUrl = `https://tidal.com/track/${item.id}`;

        return {
          track: {
            id: `${targetPlatform}-${item.id}`,
            name: item.title,
            artist: item.artist || cleanedArtist,
            thumbnailUrl: item.thumbnailUrl,
            durationSec: item.durationSec || sourceDurationSec || 215,
            durationMs: (item.durationSec || 215) * 1000,
            url: platformUrl,
            platform: targetPlatform,
            durationDiffSec: sourceDurationSec ? Math.abs((item.durationSec || 215) - sourceDurationSec) : 0,
          },
        };
      }
    }
  }

  // Synthesize realistic match for any track
  const genId = `${targetPlatform}-gen-${Math.random().toString(36).substring(2, 9)}`;
  const estDur = sourceDurationSec || 210;

  let platformUrl = '';
  if (targetPlatform === 'spotify') platformUrl = `https://open.spotify.com/track/${genId}`;
  else if (targetPlatform === 'youtube') platformUrl = `https://music.youtube.com/watch?v=${genId}`;
  else if (targetPlatform === 'amazon') platformUrl = `https://music.amazon.com/tracks/${genId}`;
  else if (targetPlatform === 'jiosaavn') platformUrl = `https://www.jiosaavn.com/song/${genId}`;
  else if (targetPlatform === 'tidal') platformUrl = `https://tidal.com/track/${genId}`;

  return {
    track: {
      id: genId,
      name: `${cleanedTitle}`,
      artist: `${cleanedArtist}`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      durationSec: estDur,
      durationMs: estDur * 1000,
      url: platformUrl,
      platform: targetPlatform,
      durationDiffSec: 0,
    },
  };
}

export function searchMockSpotify(
  cleanedTitle: string,
  cleanedArtist: string,
  sourceDurationSec?: number
): { track: SpotifyTrackResult | null; reason?: string } {
  const result = searchMockUniversal('spotify', cleanedTitle, cleanedArtist, sourceDurationSec);
  if (!result.track) return { track: null, reason: result.reason };

  return {
    track: {
      id: result.track.id,
      name: result.track.name,
      artist: result.track.artist,
      artists: [result.track.artist],
      albumName: 'Universal Catalog',
      albumImageUrl: result.track.thumbnailUrl,
      uri: `spotify:track:${result.track.id}`,
      durationMs: result.track.durationMs || (result.track.durationSec * 1000),
      durationSec: result.track.durationSec,
      spotifyUrl: result.track.url,
      durationDiffSec: result.track.durationDiffSec,
    },
  };
}

export function searchMockYouTube(
  cleanedTitle: string,
  cleanedArtist: string,
  sourceDurationSec?: number
): { track: YouTubeTrackResult | null; reason?: string } {
  const result = searchMockUniversal('youtube', cleanedTitle, cleanedArtist, sourceDurationSec);
  if (!result.track) return { track: null, reason: result.reason };

  return {
    track: {
      id: result.track.id,
      name: result.track.name,
      artist: result.track.artist,
      channelTitle: `${result.track.artist} - Topic`,
      thumbnailUrl: result.track.thumbnailUrl,
      durationSec: result.track.durationSec,
      url: result.track.url,
      durationDiffSec: result.track.durationDiffSec,
    },
  };
}
