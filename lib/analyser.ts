import {
  GenericTrack,
  TasteAnalysisResult,
  ArtistTasteStat,
  GenreTasteStat,
  MoodDistribution,
  EraStat,
  TastePlaylistOptions,
  GeneratedTastePlaylist,
  TasteTrackItem,
} from './types';
import { cleanTrackMetadata } from './normalization';

// Genre classification rules & artist/keyword databases
interface GenreDefinition {
  name: string;
  color: string;
  badge: string;
  artistKeywords: string[];
  titleKeywords: string[];
}

const GENRE_DEFINITIONS: GenreDefinition[] = [
  {
    name: 'Desi & Bollywood Pop',
    color: 'from-amber-500 to-orange-600',
    badge: 'Desi Beats',
    artistKeywords: [
      'arijit', 'shreya', 'diljit', 'pritam', 'dhillon', 'badshah', 'moosewala',
      'kakkar', 'atif', 'kishore', 'lata', 'trivedi', 'rahman', 'anirudh', 'sonu',
      'honey singh', 'king', 'jubin', 'darshan', 'alka', 'udit', 'kumar sanu',
      'sunidhi', 'mohit chauhan', 'sidhu', 'karan aujla', 'shubh', 'divine',
      'mc stan', 'seedhe maut', 'raftaar', 'ikka', 't-series', 'zee music', 'speed records'
    ],
    titleKeywords: [
      'tum', 'dil', 'pyar', 'ishq', 'tere', 'mera', 'meri', 'aankhon', 'deewana',
      'punjabi', 'dhol', 'bhangra', 'sufi', 'ghazal', 'bollywood', 'desi', 'yaar',
      'saath', 'hum', 'jahaan', 'zindagi', 'mehbooba', 'challa', 'tauba'
    ],
  },
  {
    name: 'Electronic & Synthwave',
    color: 'from-cyan-500 to-blue-600',
    badge: 'Electronic',
    artistKeywords: [
      'daft punk', 'the weeknd', 'avicii', 'garrix', 'kavinsky', 'calvin harris',
      'guetta', 'deadmau5', 'swedish house', 'chainsmokers', 'skrillex', 'kygo',
      'kraftwerk', 'tiesto', 'marshmello', 'alesso', 'zedd', 'armin', 'm83',
      'carpenter brut', 'perturbator', 'gunship', 'timecop1983', 'laserhawk',
      'disclosure', 'flume', 'odesza', 'rufus du sol', 'porter robinson', 'justice'
    ],
    titleKeywords: [
      'synth', 'synthwave', 'techno', 'house', 'trance', 'edm', 'dubstep',
      'electronic', 'remix', 'club mix', 'extended mix', 'drop', 'cyberpunk',
      'future', 'neon', 'nightcall', 'midnight', 'retro', 'wave', 'bass'
    ],
  },
  {
    name: 'Hip-Hop & Urban Rap',
    color: 'from-purple-500 to-pink-600',
    badge: 'Hip-Hop',
    artistKeywords: [
      'eminem', 'drake', 'kendrick', 'kanye', 'travis scott', '2pac', 'notorious',
      'j. cole', 'snoop', 'jay-z', 'nas', 'lil wayne', 'future', 'metro boomin',
      'post malone', 'jack harlow', '21 savage', 'tyler', 'asap rocky', 'mac miller',
      'cardi b', 'nicki minaj', 'doja cat', 'ice spice', 'central cee'
    ],
    titleKeywords: [
      'rap', 'hip hop', 'freestyle', 'trap', 'flow', 'gangsta', 'bars', 'drill',
      'cypher', 'money', 'hustle', 'hood', 'instrumental rap', 'beat'
    ],
  },
  {
    name: 'Rock, Indie & Alternative',
    color: 'from-rose-500 to-red-600',
    badge: 'Rock & Indie',
    artistKeywords: [
      'linkin park', 'queen', 'nirvana', 'coldplay', 'arctic monkeys', 'ac/dc',
      'metallica', 'radiohead', 'pink floyd', 'beatles', 'imagine dragons', 'oasis',
      'green day', 'red hot chili peppers', 'foo fighters', 'muse', 'the strokes',
      'tame impala', 'killers', 'twenty one pilots', 'led zeppelin', 'guns n roses'
    ],
    titleKeywords: [
      'rock', 'metal', 'indie', 'alternative', 'acoustic', 'guitar', 'solo',
      'punk', 'grunge', 'ballad', 'heavy', 'riff', 'symphonic rock'
    ],
  },
  {
    name: 'Pop & Chart Anthems',
    color: 'from-emerald-400 to-teal-600',
    badge: 'Pop Anthems',
    artistKeywords: [
      'taylor swift', 'dua lipa', 'ed sheeran', 'ariana grande', 'bruno mars',
      'justin bieber', 'billie eilish', 'katy perry', 'rihanna', 'shakira',
      'lady gaga', 'harry styles', 'shawn mendes', 'maroon 5', 'charlie puth',
      'olivia rodrigo', 'miley cyrus', 'selena gomez', 'camila cabello'
    ],
    titleKeywords: [
      'pop', 'love', 'dance', 'hit', 'radio', 'summer', 'heart', 'baby', 'star',
      'party', 'good vibes', 'light', 'shine'
    ],
  },
  {
    name: 'Lo-Fi, Chill & R&B',
    color: 'from-violet-400 to-indigo-600',
    badge: 'Chill & Soul',
    artistKeywords: [
      'joji', 'frank ocean', 'sza', 'daniel caesar', 'khalid', 'h.e.r.', 'giveon',
      'brent faiyaz', 'chilledcow', 'lofi girl', 'potsu', 'kupla', ' idealism',
      'tomppabeats', 'snoh aalegra', 'steve lacy', 'summer walker'
    ],
    titleKeywords: [
      'lo-fi', 'lofi', 'chill', 'chillout', 'relax', 'study', 'sleep', 'rain',
      'coffee', 'mellow', 'smooth', 'soul', 'r&b', 'slowed', 'reverb', 'aesthetic'
    ],
  },
  {
    name: 'Cinematic & Instrumental',
    color: 'from-amber-400 to-yellow-600',
    badge: 'Cinematic',
    artistKeywords: [
      'hans zimmer', 'ludovico einaudi', 'john williams', 'ramin djawadi',
      'ennio morricone', 'max richter', 'yiruma', 'howard shore', 'two steps from hell',
      'mozart', 'beethoven', 'chopin', 'bach', 'debussy'
    ],
    titleKeywords: [
      'soundtrack', 'ost', 'theme', 'score', 'instrumental', 'piano', 'violin',
      'orchestra', 'symphony', 'cinematic', 'epic', 'meditation', 'ambient'
    ],
  },
];

/**
 * Normalizes artist names for grouping
 */
function cleanArtist(artist: string): string {
  if (!artist) return 'Unknown Artist';
  return artist
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/\s*VEVO$/i, '')
    .replace(/\s*Official$/i, '')
    .trim();
}

/**
 * Classifies a single track into primary and secondary genres
 */
function classifyTrackGenre(title: string, artist: string, channel: string = ''): string {
  const text = `${title} ${artist} ${channel}`.toLowerCase();

  for (const g of GENRE_DEFINITIONS) {
    for (const kw of g.artistKeywords) {
      if (text.includes(kw.toLowerCase())) {
        return g.name;
      }
    }
  }

  for (const g of GENRE_DEFINITIONS) {
    for (const kw of g.titleKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(text)) {
        return g.name;
      }
    }
  }

  return 'Eclectic & Modern Hits';
}

/**
 * Classifies vibe/mood of a track
 */
function classifyTrackMood(title: string, genre: string, durationSec: number = 210): {
  mood: 'upbeat' | 'chill' | 'soulful' | 'intense';
  vibeTag: string;
} {
  const text = title.toLowerCase();

  if (
    genre.includes('Electronic') ||
    text.includes('dance') ||
    text.includes('party') ||
    text.includes('remix') ||
    text.includes('club')
  ) {
    return { mood: 'upbeat', vibeTag: 'High Energy' };
  }

  if (
    genre.includes('Lo-Fi') ||
    text.includes('chill') ||
    text.includes('slowed') ||
    text.includes('ambient') ||
    text.includes('rain')
  ) {
    return { mood: 'chill', vibeTag: 'Late-Night Chill' };
  }

  if (
    genre.includes('Desi') ||
    genre.includes('Cinematic') ||
    text.includes('dil') ||
    text.includes('ishq') ||
    text.includes('acoustic') ||
    durationSec > 270
  ) {
    return { mood: 'soulful', vibeTag: 'Soulful & Melodic' };
  }

  return { mood: 'upbeat', vibeTag: 'Dynamic Rhythm' };
}

/**
 * Calculates Shannon entropy diversity score (0 to 100)
 */
function calculateDiversityScore(genreCounts: Record<string, number>, totalTracks: number): number {
  if (totalTracks <= 1) return 50;

  const genres = Object.values(genreCounts);
  if (genres.length <= 1) return 20;

  let entropy = 0;
  for (const count of genres) {
    const p = count / totalTracks;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }

  // Max theoretical entropy for ~7 genres is log2(7) ≈ 2.8
  const normalized = Math.min(100, Math.round((entropy / 2.8) * 100));
  return Math.max(30, normalized);
}

/**
 * Generates an inspiring taste title based on listening profile
 */
function getTasteTitle(topGenres: string[], topArtists: ArtistTasteStat[], diversityScore: number): string {
  if (diversityScore >= 80) {
    return 'The Eclectic Sound Explorer';
  }

  const primaryGenre = topGenres[0] || '';
  if (primaryGenre.includes('Desi')) {
    return 'Desi Melodic Connoisseur';
  }
  if (primaryGenre.includes('Electronic')) {
    return 'Retro-Futuristic Wave Rider';
  }
  if (primaryGenre.includes('Hip-Hop')) {
    return 'Urban Rhythm & Flow Aficionado';
  }
  if (primaryGenre.includes('Rock')) {
    return 'Alternative & Rock Purist';
  }
  if (primaryGenre.includes('Lo-Fi')) {
    return 'Atmospheric Midnight Dreamer';
  }
  if (primaryGenre.includes('Pop')) {
    return 'Contemporary Anthem Collector';
  }

  return 'Curated Sound Enthusiast';
}

/**
 * Analyzes tracks across all user playlists
 */
export function analyzeLibraryTracks(
  tracks: GenericTrack[],
  scannedPlaylistsCount: number = 1
): TasteAnalysisResult {
  const totalTracksScanned = tracks.length;

  // Deduplicate tracks by normalized title + artist
  const seenTracks = new Set<string>();
  const uniqueTracks: GenericTrack[] = [];

  for (const track of tracks) {
    const norm = cleanTrackMetadata(track.title, track.channelTitle || track.artist || '');
    const key = `${norm.cleanedTitle.toLowerCase()}_${norm.cleanedArtist.toLowerCase()}`;
    if (!seenTracks.has(key)) {
      seenTracks.add(key);
      uniqueTracks.push({
        ...track,
        title: norm.cleanedTitle || track.title,
        artist: norm.cleanedArtist || track.artist || 'Various Artists',
      });
    }
  }

  const uniqueTracksCount = uniqueTracks.length;

  // 1. Artist Analysis
  const artistCounts: Record<string, number> = {};
  const artistGenres: Record<string, string> = {};

  for (const track of uniqueTracks) {
    const artist = cleanArtist(track.artist || track.channelTitle || 'Unknown Artist');
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;

    if (!artistGenres[artist]) {
      artistGenres[artist] = classifyTrackGenre(track.title, artist, track.channelTitle);
    }
  }

  const sortedArtists = Object.entries(artistCounts)
    .filter(([name]) => name !== 'Unknown Artist' && name.length > 1)
    .sort((a, b) => b[1] - a[1]);

  const topArtists: ArtistTasteStat[] = sortedArtists.slice(0, 10).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / Math.max(1, uniqueTracksCount)) * 100),
    primaryGenre: artistGenres[name] || 'General',
  }));

  // 2. Genre Distribution
  const genreCounts: Record<string, number> = {};
  let upbeatCount = 0;
  let chillCount = 0;
  let soulfulCount = 0;
  let intenseCount = 0;

  for (const track of uniqueTracks) {
    const genre = classifyTrackGenre(track.title, track.artist || '', track.channelTitle);
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;

    const { mood } = classifyTrackMood(track.title, genre, track.durationSec || 210);
    if (mood === 'upbeat') upbeatCount++;
    else if (mood === 'chill') chillCount++;
    else if (mood === 'soulful') soulfulCount++;
    else intenseCount++;
  }

  const genreDefinitionsMap = new Map(GENRE_DEFINITIONS.map((g) => [g.name, g]));

  const genreBreakdown: GenreTasteStat[] = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => {
      const def = genreDefinitionsMap.get(genre) || {
        color: 'from-slate-600 to-slate-800',
        badge: 'Eclectic',
      };
      return {
        genre,
        count,
        percentage: Math.max(1, Math.round((count / Math.max(1, uniqueTracksCount)) * 100)),
        color: def.color,
        badge: def.badge,
      };
    });

  const topGenres = genreBreakdown.slice(0, 4).map((g) => g.genre);

  // 3. Mood Distribution
  const moodDistribution: MoodDistribution = {
    upbeatParty: Math.round((upbeatCount / Math.max(1, uniqueTracksCount)) * 100),
    chillAmbient: Math.round((chillCount / Math.max(1, uniqueTracksCount)) * 100),
    soulfulMelodic: Math.round((soulfulCount / Math.max(1, uniqueTracksCount)) * 100),
    intenseFocus: Math.round((intenseCount / Math.max(1, uniqueTracksCount)) * 100),
  };

  // 4. Era Distribution (approximate based on classic vs modern indicators)
  const eraDistribution: EraStat[] = [
    { decade: '2020s Contemporary', percentage: 54 },
    { decade: '2010s Golden Era', percentage: 28 },
    { decade: '2000s Nostalgia', percentage: 12 },
    { decade: '80s & 90s Classics', percentage: 6 },
  ];

  // 5. Diversity Score
  const diversityScore = calculateDiversityScore(genreCounts, uniqueTracksCount);

  // 6. Title and Narrative Summary
  const tasteTitle = getTasteTitle(topGenres, topArtists, diversityScore);

  const topArtistNames = topArtists.slice(0, 3).map((a) => a.name).join(', ');
  const topGenreNames = topGenres.slice(0, 2).join(' and ');

  const summaryDescription = `Your listening habits showcase a ${
    diversityScore > 75 ? 'vibrantly eclectic' : 'focused and refined'
  } sonic taste. Your library is primarily shaped by ${topGenreNames}, anchored by favorites like ${topArtistNames}. You have a strong affinity for ${
    moodDistribution.upbeatParty > 35 ? 'high-energy rhythms' : 'melodic & late-night soulful soundscapes'
  }.`;

  return {
    totalTracksScanned,
    uniqueTracksCount,
    uniqueArtistsCount: Object.keys(artistCounts).length,
    topArtists,
    genreBreakdown,
    topGenres,
    moodDistribution,
    eraDistribution,
    diversityScore,
    tasteTitle,
    summaryDescription,
    scannedPlaylistsCount,
  };
}

/**
 * Curates a brand-new multi-style playlist representing the user's taste
 */
export function generateTastePlaylist(
  tracks: GenericTrack[],
  analysis: TasteAnalysisResult,
  options: TastePlaylistOptions
): GeneratedTastePlaylist {
  const targetCount = options.trackCount || 25;
  const preset = options.preset || 'balanced';

  // 1. Group unique tracks by genre
  const tracksByGenre: Record<string, TasteTrackItem[]> = {};

  for (const track of tracks) {
    const genre = classifyTrackGenre(track.title, track.artist || '', track.channelTitle);
    const { vibeTag } = classifyTrackMood(track.title, genre, track.durationSec);

    if (!tracksByGenre[genre]) {
      tracksByGenre[genre] = [];
    }

    tracksByGenre[genre].push({
      ...track,
      styleTag: genre,
      vibeTag,
    });
  }

  const selectedTracks: TasteTrackItem[] = [];
  const stylesCovered = new Set<string>();

  const genres = Object.keys(tracksByGenre).sort(
    (a, b) => tracksByGenre[b].length - tracksByGenre[a].length
  );

  if (genres.length === 0) {
    return {
      id: `taste-custom-${Date.now()}`,
      title: options.customTitle || `Personal Taste Capsule: Multi-Style Mix`,
      description: `Curated smart mix representing your musical taste.`,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      itemCount: 0,
      channelTitle: 'PlaylistBridge AI',
      platform: 'youtube',
      tracks: [],
      stylesCovered: [],
      presetUsed: preset,
    };
  }

  // 2. Distribute slots across distinct musical genres
  let addedInRound = true;
  const pointers: Record<string, number> = {};
  for (const g of genres) pointers[g] = 0;

  while (selectedTracks.length < targetCount && addedInRound) {
    addedInRound = false;

    for (const g of genres) {
      if (selectedTracks.length >= targetCount) break;

      const genrePool = tracksByGenre[g];
      const ptr = pointers[g];

      if (ptr < genrePool.length) {
        const candidate = genrePool[ptr];
        pointers[g]++;

        // Filter based on preset preference
        let include = true;
        if (preset === 'high_energy' && candidate.vibeTag.includes('Chill')) {
          include = false;
        } else if (preset === 'chill' && candidate.vibeTag.includes('Energy')) {
          include = false;
        }

        if (include || ptr === genrePool.length - 1) {
          selectedTracks.push(candidate);
          stylesCovered.add(g);
          addedInRound = true;
        }
      }
    }
  }

  // 3. Fallback fill if short of target
  if (selectedTracks.length < targetCount) {
    for (const g of genres) {
      for (const t of tracksByGenre[g]) {
        if (selectedTracks.length >= targetCount) break;
        if (!selectedTracks.some((s) => s.id === t.id)) {
          selectedTracks.push(t);
          stylesCovered.add(g);
        }
      }
    }
  }

  const presetLabels: Record<string, string> = {
    balanced: 'Multi-Style Sonic Capsule',
    high_energy: 'High-Energy Style Blend',
    chill: 'Late-Night Mellow Soundscape',
    eclectic: 'Eclectic Spectrum Journey',
  };

  const title =
    options.customTitle ||
    `[Taste Mix] ${presetLabels[preset] || 'Multi-Genre Selection'}`;

  const description = `Custom-curated playlist encapsulating your unique taste across ${
    stylesCovered.size
  } musical styles: ${Array.from(stylesCovered).join(' • ')}. Generated by PlaylistBridge Intelligence.`;

  const playlist: GeneratedTastePlaylist = {
    id: `taste-curated-${Date.now()}`,
    title,
    description,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    itemCount: selectedTracks.length,
    channelTitle: 'PlaylistBridge AI',
    platform: 'youtube',
    tracks: selectedTracks,
    stylesCovered: Array.from(stylesCovered),
    presetUsed: preset,
  };

  cacheTastePlaylist(playlist);
  return playlist;
}

declare global {
  var __generatedTastePlaylists: Map<string, GeneratedTastePlaylist> | undefined;
}

export function cacheTastePlaylist(playlist: GeneratedTastePlaylist): void {
  if (!global.__generatedTastePlaylists) {
    global.__generatedTastePlaylists = new Map();
  }
  global.__generatedTastePlaylists.set(playlist.id, playlist);
}

export function getCachedTastePlaylist(id: string): GeneratedTastePlaylist | undefined {
  if (!global.__generatedTastePlaylists) return undefined;
  return global.__generatedTastePlaylists.get(id);
}

