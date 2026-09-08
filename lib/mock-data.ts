import { GenericPlaylist, GenericTrack, SpotifyTrackResult, YouTubeTrackResult } from './types';

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
    {
      id: 'sp-8',
      title: 'Ultra Rare Obscure Soundscape [Demo]',
      artist: 'Unknown Artist 99',
      durationSec: 512,
      durationMs: 512000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:unknown',
    },
  ],
  'sp-pl-synth-hits': [
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
      title: 'Get Lucky',
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
  'sp-pl-rock-classics': [
    {
      id: 'sp-rk-1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      durationSec: 354,
      durationMs: 354320,
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:4u7EnebtmKWzUH433cf5Qv',
    },
    {
      id: 'sp-rk-2',
      title: 'Smells Like Teen Spirit',
      artist: 'Nirvana',
      durationSec: 301,
      durationMs: 301920,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:5ghIWrDAZ8jX6mnNsj2Kb0',
    },
    {
      id: 'sp-rk-3',
      title: 'Everlong',
      artist: 'Foo Fighters',
      durationSec: 250,
      durationMs: 250560,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:5UWwZ5lm5tZA9VgnZumAhf',
    },
    {
      id: 'sp-rk-4',
      title: 'Mr. Brightside',
      artist: 'The Killers',
      durationSec: 223,
      durationMs: 222973,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:003vvx7Niy0Jmu2scZFqRd',
    },
    {
      id: 'sp-rk-5',
      title: 'Do I Wanna Know?',
      artist: 'Arctic Monkeys',
      durationSec: 272,
      durationMs: 272394,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:5FVd6KXrgO9B3JPmC8OPst',
    },
    {
      id: 'sp-rk-6',
      title: 'Californication',
      artist: 'Red Hot Chili Peppers',
      durationSec: 321,
      durationMs: 321533,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:48UPSzbZjLjgq0ChmpBs20',
    },
    {
      id: 'sp-rk-7',
      title: 'Creep',
      artist: 'Radiohead',
      durationSec: 236,
      durationMs: 236440,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:70LAV211u5qC4Gz9Vb3e3j',
    },
  ],
  'sp-pl-chill-beats': [
    {
      id: 'sp-lf-1',
      title: 'A Light of Mine',
      artist: 'Kudasai',
      durationSec: 142,
      durationMs: 142100,
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:37rR5fT8Y7uX19x0j9kH0P',
    },
    {
      id: 'sp-lf-2',
      title: 'Both of Us',
      artist: 'Idealism',
      durationSec: 154,
      durationMs: 154200,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:45kL6Y7uX19x0j9kH0P88r',
    },
    {
      id: 'sp-lf-3',
      title: 'Affection',
      artist: 'Jinsang',
      durationSec: 130,
      durationMs: 130000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:5TkR7fT8Y7uX19x0j9kH2Z',
    },
    {
      id: 'sp-lf-4',
      title: 'Monday Loop',
      artist: 'Tomppabeats',
      durationSec: 98,
      durationMs: 98000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:67uR7fT8Y7uX19x0j9kH33',
    },
    {
      id: 'sp-lf-5',
      title: 'Feather',
      artist: 'Nujabes',
      durationSec: 175,
      durationMs: 175000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:2EjXfH91ZZUQDo97Bp9du0',
    },
    {
      id: 'sp-lf-6',
      title: 'Obscure Ambient Sound',
      artist: 'Unknown',
      durationSec: 86400,
      durationMs: 86400000,
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
      uri: 'spotify:track:unknown',
    },
  ],
};

export const MOCK_SPOTIFY_CATALOG: SpotifyTrackResult[] = [
  {
    id: 'sp-1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    artists: ['The Weeknd'],
    albumName: 'After Hours',
    albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
    durationMs: 200040,
    durationSec: 200,
    spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
  },
  {
    id: 'sp-2',
    name: 'Get Lucky',
    artist: 'Daft Punk',
    artists: ['Daft Punk', 'Pharrell Williams', 'Nile Rodgers'],
    albumName: 'Random Access Memories',
    albumImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:69kOkLUCkxIZYexIgSG8rq',
    durationMs: 248413,
    durationSec: 248,
    spotifyUrl: 'https://open.spotify.com/track/69kOkLUCkxIZYexIgSG8rq',
  },
  {
    id: 'sp-3',
    name: 'Midnight City',
    artist: 'M83',
    artists: ['M83'],
    albumName: 'Hurry Up, We\'re Dreaming',
    albumImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:6GyFP1nfCDB8Jyik978UXW',
    durationMs: 243266,
    durationSec: 243,
    spotifyUrl: 'https://open.spotify.com/track/6GyFP1nfCDB8Jyik978UXW',
  },
  {
    id: 'sp-4',
    name: 'Nightcall',
    artist: 'Kavinsky',
    artists: ['Kavinsky'],
    albumName: 'OutRun',
    albumImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:0u0W5BKyAhQ66487WjG9jH',
    durationMs: 259346,
    durationSec: 259,
    spotifyUrl: 'https://open.spotify.com/track/0u0W5BKyAhQ66487WjG9jH',
  },
  {
    id: 'sp-5',
    name: 'Starboy',
    artist: 'The Weeknd',
    artists: ['The Weeknd', 'Daft Punk'],
    albumName: 'Starboy',
    albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:7MXVkk9YM5IZxh0vL21tK2',
    durationMs: 230453,
    durationSec: 230,
    spotifyUrl: 'https://open.spotify.com/track/7MXVkk9YM5IZxh0vL21tK2',
  },
  {
    id: 'sp-6',
    name: 'Turbo Killer',
    artist: 'Carpenter Brut',
    artists: ['Carpenter Brut'],
    albumName: 'Trilogy',
    albumImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:10qbHF9200A5RIpZ3xV96o',
    durationMs: 208466,
    durationSec: 208,
    spotifyUrl: 'https://open.spotify.com/track/10qbHF9200A5RIpZ3xV96o',
  },
  {
    id: 'sp-7',
    name: 'Tech Noir',
    artist: 'GUNSHIP',
    artists: ['GUNSHIP', 'John Carpenter', 'Charlie Simpson'],
    albumName: 'GUNSHIP',
    albumImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:27NeeG23Yy2wB6960vHk2M',
    durationMs: 297293,
    durationSec: 297,
    spotifyUrl: 'https://open.spotify.com/track/27NeeG23Yy2wB6960vHk2M',
  },
  {
    id: 'sp-lf-1',
    name: 'A Light of Mine',
    artist: 'Kudasai',
    artists: ['Kudasai'],
    albumName: 'Falling',
    albumImageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:37rR5fT8Y7uX19x0j9kH0P',
    durationMs: 142100,
    durationSec: 142,
    spotifyUrl: 'https://open.spotify.com/track/37rR5fT8Y7uX19x0j9kH0P',
  },
  {
    id: 'sp-lf-2',
    name: 'Both of Us',
    artist: 'Idealism',
    artists: ['Idealism'],
    albumName: 'Rainy Evening',
    albumImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:45kL6Y7uX19x0j9kH0P88r',
    durationMs: 154200,
    durationSec: 154,
    spotifyUrl: 'https://open.spotify.com/track/45kL6Y7uX19x0j9kH0P88r',
  },
  {
    id: 'sp-lf-3',
    name: 'Affection',
    artist: 'Jinsang',
    artists: ['Jinsang'],
    albumName: 'Life',
    albumImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:5TkR7fT8Y7uX19x0j9kH2Z',
    durationMs: 130000,
    durationSec: 130,
    spotifyUrl: 'https://open.spotify.com/track/5TkR7fT8Y7uX19x0j9kH2Z',
  },
  {
    id: 'sp-lf-4',
    name: 'Monday Loop',
    artist: 'Tomppabeats',
    artists: ['Tomppabeats'],
    albumName: 'Harbor LP',
    albumImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:67uR7fT8Y7uX19x0j9kH33',
    durationMs: 98000,
    durationSec: 98,
    spotifyUrl: 'https://open.spotify.com/track/67uR7fT8Y7uX19x0j9kH33',
  },
  {
    id: 'sp-lf-5',
    name: 'Feather',
    artist: 'Nujabes',
    artists: ['Nujabes', 'Cise Starr', 'Akin'],
    albumName: 'Modal Soul',
    albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:2EjXfH91ZZUQDo97Bp9du0',
    durationMs: 175000,
    durationSec: 175,
    spotifyUrl: 'https://open.spotify.com/track/2EjXfH91ZZUQDo97Bp9du0',
  },
  {
    id: 'sp-rk-1',
    name: 'Bohemian Rhapsody',
    artist: 'Queen',
    artists: ['Queen'],
    albumName: 'A Night At The Opera',
    albumImageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:4u7EnebtmKWzUH433cf5Qv',
    durationMs: 354320,
    durationSec: 354,
    spotifyUrl: 'https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv',
  },
  {
    id: 'sp-rk-2',
    name: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    artists: ['Nirvana'],
    albumName: 'Nevermind',
    albumImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:5ghIWrDAZ8jX6mnNsj2Kb0',
    durationMs: 301920,
    durationSec: 301,
    spotifyUrl: 'https://open.spotify.com/track/5ghIWrDAZ8jX6mnNsj2Kb0',
  },
  {
    id: 'sp-rk-3',
    name: 'Everlong',
    artist: 'Foo Fighters',
    artists: ['Foo Fighters'],
    albumName: 'The Colour And The Shape',
    albumImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:5UWwZ5lm5tZA9VgnZumAhf',
    durationMs: 250560,
    durationSec: 250,
    spotifyUrl: 'https://open.spotify.com/track/5UWwZ5lm5tZA9VgnZumAhf',
  },
  {
    id: 'sp-rk-4',
    name: 'Mr. Brightside',
    artist: 'The Killers',
    artists: ['The Killers'],
    albumName: 'Hot Fuss',
    albumImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:003vvx7Niy0Jmu2scZFqRd',
    durationMs: 222973,
    durationSec: 223,
    spotifyUrl: 'https://open.spotify.com/track/003vvx7Niy0Jmu2scZFqRd',
  },
  {
    id: 'sp-rk-5',
    name: 'Do I Wanna Know?',
    artist: 'Arctic Monkeys',
    artists: ['Arctic Monkeys'],
    albumName: 'AM',
    albumImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:5FVd6KXrgO9B3JPmC8OPst',
    durationMs: 272394,
    durationSec: 272,
    spotifyUrl: 'https://open.spotify.com/track/5FVd6KXrgO9B3JPmC8OPst',
  },
  {
    id: 'sp-rk-6',
    name: 'Californication',
    artist: 'Red Hot Chili Peppers',
    artists: ['Red Hot Chili Peppers'],
    albumName: 'Californication',
    albumImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:48UPSzbZjLjgq0ChmpBs20',
    durationMs: 321533,
    durationSec: 321,
    spotifyUrl: 'https://open.spotify.com/track/48UPSzbZjLjgq0ChmpBs20',
  },
  {
    id: 'sp-rk-7',
    name: 'Creep',
    artist: 'Radiohead',
    artists: ['Radiohead'],
    albumName: 'Pablo Honey',
    albumImageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80',
    uri: 'spotify:track:70LAV211u5qC4Gz9Vb3e3j',
    durationMs: 236440,
    durationSec: 236,
    spotifyUrl: 'https://open.spotify.com/track/70LAV211u5qC4Gz9Vb3e3j',
  },
];

/**
 * Searches the mock Spotify catalog using fuzzy text similarity and duration check.
 */
export function searchMockSpotify(
  cleanedTitle: string,
  cleanedArtist: string,
  sourceDurationSec?: number
): { track: SpotifyTrackResult | null; reason?: string } {
  const normTitle = cleanedTitle.toLowerCase().trim();
  const normArtist = cleanedArtist.toLowerCase().trim();

  // 1. Direct title and artist match
  for (const item of MOCK_SPOTIFY_CATALOG) {
    const itemTitle = item.name.toLowerCase();
    const itemArtist = item.artist.toLowerCase();
    const artistArray = item.artists.map((a) => a.toLowerCase());

    const titleMatch =
      itemTitle.includes(normTitle) || normTitle.includes(itemTitle);
    const artistMatch =
      itemArtist.includes(normArtist) ||
      normArtist.includes(itemArtist) ||
      artistArray.some((a) => a.includes(normArtist) || normArtist.includes(a));

    if (titleMatch && artistMatch) {
      if (sourceDurationSec && sourceDurationSec > 0) {
        const diffSec = Math.abs(item.durationSec - sourceDurationSec);
        if (diffSec > 60 && sourceDurationSec > 500) {
          return {
            track: null,
            reason: `Duration mismatch (${item.durationSec}s vs source ${sourceDurationSec}s exceeds threshold)`,
          };
        }
      }
      return { track: item };
    }
  }

  // 2. Fallback search: Title only
  for (const item of MOCK_SPOTIFY_CATALOG) {
    const itemTitle = item.name.toLowerCase();
    if (itemTitle.includes(normTitle) || normTitle.includes(itemTitle)) {
      return { track: item };
    }
  }

  return {
    track: null,
    reason: `No matching tracks found in Spotify catalog for "${cleanedTitle}" by "${cleanedArtist}"`,
  };
}

/**
 * Searches the mock YouTube catalog when migrating from Spotify to YouTube Music.
 */
export function searchMockYouTube(
  cleanedTitle: string,
  cleanedArtist: string,
  sourceDurationSec?: number
): { track: YouTubeTrackResult | null; reason?: string } {
  const normTitle = cleanedTitle.toLowerCase().trim();
  const normArtist = cleanedArtist.toLowerCase().trim();

  // Search through all mock youtube tracks
  const allYtTracks = Object.values(MOCK_YOUTUBE_TRACKS).flat();

  for (const item of allYtTracks) {
    const itemTitle = item.title.toLowerCase();
    const itemChannel = (item.channelTitle || '').toLowerCase();

    if (itemTitle.includes(normTitle) || itemTitle.includes(normArtist) || itemChannel.includes(normArtist)) {
      if (sourceDurationSec && item.durationSec) {
        const diffSec = Math.abs(item.durationSec - sourceDurationSec);
        if (diffSec > 60 && sourceDurationSec > 500) {
          return {
            track: null,
            reason: `Duration mismatch (${item.durationSec}s vs source ${sourceDurationSec}s exceeds threshold)`,
          };
        }
      }
      return {
        track: {
          id: item.id,
          name: item.title,
          artist: item.channelTitle || cleanedArtist,
          channelTitle: item.channelTitle || '',
          thumbnailUrl: item.thumbnailUrl,
          durationSec: item.durationSec || sourceDurationSec || 210,
          url: `https://music.youtube.com/watch?v=${item.id}`,
        },
      };
    }
  }

  // If unknown track or deliberate failure
  if (normTitle.includes('ultra rare') || normTitle.includes('unknown')) {
    return {
      track: null,
      reason: `No matching YouTube video or official audio found for "${cleanedTitle}"`,
    };
  }

  // Synthesize realistic match for demo
  const mockVideoId = `yt-gen-${Math.random().toString(36).substring(2, 9)}`;
  const estDuration = sourceDurationSec || 215;
  return {
    track: {
      id: mockVideoId,
      name: `${cleanedArtist} - ${cleanedTitle} (Official Audio)`,
      artist: cleanedArtist,
      channelTitle: `${cleanedArtist} - Topic`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
      durationSec: estDuration,
      url: `https://music.youtube.com/watch?v=${mockVideoId}`,
    },
  };
}
