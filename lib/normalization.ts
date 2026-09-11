import { CleanedTrackMetadata, YouTubeTrack } from './types';

/**
 * Noise filters matching typical YouTube music video title suffixes, tags, and decorators.
 */
const NOISE_REGEXES = [
  // Parentheses or brackets containing common video/audio keywords
  /\s*[\(\[]\s*[^)\]]*(official|music\s*video|audio|video|lyrics?|lyrical|hd|4k|8k|remaster|visualizer|mix|ver(\.|\b)|version|prod|explicit|clean|clip|soundtrack|ost|live|session|edit|remix|hq|hq audio|uhd|full\s*song|full\s*video|promo|teaser)[^)\]]*[\)\]]/gi,

  // Bracketed tags: [anything short or tag-like]
  /\s*\[\s*(mv|m\/v|pv|hq|hd|4k|8k|audio|lyrics?|official|explicit|clean|visualizer|topic|full\s*song)\s*\]/gi,

  // Trailing noise without brackets: - Official Music Video, | Official Video, | Lyrical Video, etc.
  /\s*[-–—|•/]\s*official\s*(music\s*)?(video|audio|visualizer|lyric\s*video|lyrical\s*video)?\s*$/gi,
  /\s*[-–—|•/]\s*(music\s*video|lyric\s*video|lyrical\s*video|audio\s*video|official\s*hd|4k\s*video|full\s*video\s*song|full\s*video|full\s*song|lyrical)\s*$/gi,
  /\s*[-–—|•/]\s*(video\s*song|audio\s*song|video|audio)\s*$/gi,
];

/**
 * Featured artist regex patterns to clean song title for cleaner Spotify matching
 */
const FEAT_REGEXES = [
  /\s*[\(\[]\s*(feat|ft|featuring)\.?\s+[^)\]]+[\)\]]/gi,
  /\s+(feat|ft|featuring)\.?\s+[^–—:\-|•\n]+/gi,
];

/**
 * Cleans YouTube channel names (e.g. "Daft Punk - Topic" -> "Daft Punk", "T-Series" -> "T-Series")
 */
export function cleanChannelName(channelName: string): string {
  if (!channelName) return '';
  let cleaned = channelName.trim();
  cleaned = cleaned.replace(/\s*-\s*Topic$/i, '');
  cleaned = cleaned.replace(/VEVO$/i, '');
  cleaned = cleaned.replace(/\s*(Official|Records|Channel|Music|Studio)$/i, '');
  return cleaned.trim();
}

/**
 * Parses ISO 8601 duration strings from YouTube API into seconds.
 */
export function parseYouTubeDuration(isoDuration?: string): number | undefined {
  if (!isoDuration) return undefined;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Core Track Normalization Function
 * Cleans YouTube noise, handles multilingual titles (e.g. Hindi + Romanized Hindi),
 * and extracts separated Artist and Song Title.
 */
export function cleanTrackMetadata(
  title: string,
  channelTitle: string = '',
  rawDurationSec?: number
): CleanedTrackMetadata {
  const originalTitle = title || '';
  let workingTitle = originalTitle.trim();

  // 1. Remove quotation marks
  workingTitle = workingTitle.replace(/^["'“‘](.*)["'”’]$/, '$1').trim();

  // 2. First pass noise filter on full string
  for (const regex of NOISE_REGEXES) {
    workingTitle = workingTitle.replace(regex, ' ');
  }

  // Remove trailing standalone words like "Video", "Lyrical", "Full Song"
  workingTitle = workingTitle.replace(/\b(official\s+video|music\s+video|lyric\s+video|lyrical\s+video|video\s+song|video|audio)\b/gi, ' ');

  let artist = '';
  let songTitle = '';

  // 3. Check for separators: "Artist - Title", "Movie | Song | Singer", etc.
  // In Indian music, often: "Movie - Song Video | Singer | Director"
  const pipeParts = workingTitle.split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  const hyphenMatch = workingTitle.match(/^(.*?)\s*[-–—:]\s*(.*)$/);

  if (pipeParts.length >= 2) {
    // Pipe separated, e.g. "Sigaram Thodu - Pidikkudhae | Vikram Prabhu | D. Imman"
    // Part 0 is usually Movie - Song, subsequent parts are artists/actors
    const firstPart = pipeParts[0];
    const subHyphen = firstPart.match(/^(.*?)\s*[-–—:]\s*(.*)$/);
    if (subHyphen) {
      songTitle = subHyphen[2].trim();
      artist = pipeParts.slice(1).join(' ').trim() || subHyphen[1].trim();
    } else {
      songTitle = firstPart;
      artist = pipeParts.slice(1).join(' ').trim();
    }
  } else if (hyphenMatch) {
    const rawPart1 = hyphenMatch[1].trim();
    const rawPart2 = hyphenMatch[2].trim();

    if (rawPart2.toLowerCase().includes(' by ')) {
      const byParts = rawPart2.split(/\s+by\s+/i);
      songTitle = byParts[0].trim();
      artist = byParts[1].trim();
    } else {
      artist = rawPart1;
      songTitle = rawPart2;
    }
  } else if (workingTitle.toLowerCase().includes(' by ')) {
    const byParts = workingTitle.split(/\s+by\s+/i);
    songTitle = byParts[0].trim();
    artist = byParts[1].trim();
  } else {
    songTitle = workingTitle;
    artist = cleanChannelName(channelTitle);
  }

  // 4. Second pass noise filter
  for (const regex of NOISE_REGEXES) {
    songTitle = songTitle.replace(regex, ' ');
    artist = artist.replace(regex, ' ');
  }

  // 5. Strip feature artists from song title
  let cleanedSongTitle = songTitle;
  for (const featRegex of FEAT_REGEXES) {
    cleanedSongTitle = cleanedSongTitle.replace(featRegex, ' ');
  }

  let cleanedArtist = artist;
  for (const featRegex of FEAT_REGEXES) {
    cleanedArtist = cleanedArtist.replace(featRegex, ' ');
  }

  // 6. Clean extra punctuation like ! and trailing commas
  cleanedSongTitle = cleanedSongTitle
    .replace(/[,\-_./|!:]+$/, '')
    .replace(/^[,\-_./|!:]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  cleanedArtist = cleanChannelName(cleanedArtist)
    .replace(/[,\-_./|!:]+$/, '')
    .replace(/^[,\-_./|!:]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If title has comma separated parts (e.g. "Hindi title, English title, Singer Bhajan")
  // Keep the title clean but preserve original
  if (!cleanedArtist && channelTitle) {
    cleanedArtist = cleanChannelName(channelTitle);
  }

  return {
    originalTitle,
    channelTitle,
    cleanedTitle: cleanedSongTitle || workingTitle,
    cleanedArtist: cleanedArtist || 'Unknown Artist',
    rawDurationSec,
  };
}

/**
 * Builds search queries for the Spotify catalog.
 * CRITICAL: Uses Unicode letters/numbers (\p{L}\p{N}) so Hindi, Tamil, Punjabi,
 * Telugu, Korean, Japanese, and all non-Latin scripts are NEVER stripped!
 */
export function buildSpotifySearchQueries(cleaned: CleanedTrackMetadata): {
  strictQuery: string;
  fallbackQuery: string;
  broadQuery: string;
  alternateQueries?: string[];
} {
  // Strip punctuation and special symbols while preserving all letters in any language/script
  const cleanTitle = cleaned.cleanedTitle
    .replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const cleanArtist = cleaned.cleanedArtist
    .replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Structured query: track:X artist:Y (only if artist is not generic)
  const isGenericArtist =
    !cleanArtist ||
    /^(unknown|various|topic|channel|user|music)$/i.test(cleanArtist) ||
    cleanArtist.length < 2;

  const strictQuery = !isGenericArtist
    ? `track:${cleanTitle} artist:${cleanArtist}`
    : cleanTitle;

  // 2. Fallback query: combined title + artist
  const fallbackQuery = !isGenericArtist
    ? `${cleanTitle} ${cleanArtist}`.trim()
    : cleanTitle;

  // 3. Broad query: just song title
  const broadQuery = cleanTitle;

  // 4. Alternate queries for multilingual Indian music (e.g. "Hindi Part , Romanized Part")
  const alternateQueries: string[] = [];

  // Check if title has comma, pipe, or dash separators with Romanized text
  const parts = cleaned.originalTitle
    .split(/[,!|–—\-]/)
    .map((p) => p.replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ').trim())
    .filter((p) => p.length > 3);

  for (const part of parts) {
    if (/[a-zA-Z]{3,}/.test(part) && part !== cleanTitle) {
      alternateQueries.push(part);
      if (!isGenericArtist) {
        alternateQueries.push(`${part} ${cleanArtist}`.trim());
      }
    }
  }

  return {
    strictQuery,
    fallbackQuery,
    broadQuery,
    alternateQueries,
  };
}

/**
 * Checks if a Spotify candidate duration is within allowed tolerance (default ±12 seconds).
 */
export function isDurationValid(
  spotifyDurationMs: number,
  sourceDurationSec?: number,
  toleranceSec: number = 12
): { valid: boolean; diffSec: number } {
  if (!sourceDurationSec || sourceDurationSec <= 0) {
    // If source duration is unknown, allow match
    return { valid: true, diffSec: 0 };
  }

  const spotifySec = spotifyDurationMs / 1000;
  const diffSec = Math.abs(spotifySec - sourceDurationSec);

  return {
    valid: diffSec <= toleranceSec,
    diffSec: Math.round(diffSec * 10) / 10,
  };
}
