import { CleanedTrackMetadata, YouTubeTrack } from './types';

/**
 * Noise filters matching typical YouTube music video title suffixes, tags, and decorators.
 */
const NOISE_REGEXES = [
  // Parentheses or brackets containing common video/audio keywords
  /\s*[\(\[]\s*[^)\]]*(official|music\s*video|audio|video|lyrics?|hd|4k|8k|remaster|visualizer|mix|ver(\.|\b)|version|prod|explicit|clean|clip|soundtrack|ost|live|session|edit|remix|hq|hq audio|uhd)[^)\]]*[\)\]]/gi,

  // Bracketed tags: [anything short or tag-like]
  /\s*\[\s*(mv|m\/v|pv|hq|hd|4k|8k|audio|lyrics?|official|explicit|clean|visualizer|topic)\s*\]/gi,

  // Trailing noise without brackets: - Official Music Video, | Official Video, etc.
  /\s*[-–—|•/]\s*official\s*(music\s*)?(video|audio|visualizer|lyric\s*video)?\s*$/gi,
  /\s*[-–—|•/]\s*(music\s*video|lyric\s*video|audio\s*video|official\s*hd|4k\s*video)\s*$/gi,
];

/**
 * Featured artist regex patterns to clean song title for cleaner Spotify matching
 */
const FEAT_REGEXES = [
  /\s*[\(\[]\s*(feat|ft|featuring)\.?\s+[^)\]]+[\)\]]/gi,
  /\s+(feat|ft|featuring)\.?\s+[^–—:\-|•\n]+/gi,
];

/**
 * Cleans YouTube channel names (e.g. "Daft Punk - Topic" -> "Daft Punk", "EminemVEVO" -> "Eminem")
 */
export function cleanChannelName(channelName: string): string {
  if (!channelName) return '';
  let cleaned = channelName.trim();
  // Remove " - Topic"
  cleaned = cleaned.replace(/\s*-\s*Topic$/i, '');
  // Remove "VEVO" suffix
  cleaned = cleaned.replace(/VEVO$/i, '');
  // Remove "Official", "Records", "Channel", "Music" at end
  cleaned = cleaned.replace(/\s*(Official|Records|Channel|Music|Studio)$/i, '');
  return cleaned.trim();
}

/**
 * Parses ISO 8601 duration strings from YouTube API (e.g., "PT3M45S", "PT1H2M10S") into seconds.
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
 * Cleans YouTube noise and extracts separated Artist and Song Title.
 */
export function cleanTrackMetadata(
  title: string,
  channelTitle: string = '',
  rawDurationSec?: number
): CleanedTrackMetadata {
  const originalTitle = title || '';
  let workingTitle = originalTitle.trim();

  // 1. First pass noise filter on full string
  for (const regex of NOISE_REGEXES) {
    workingTitle = workingTitle.replace(regex, ' ');
  }

  // 2. Remove quotation marks
  workingTitle = workingTitle.replace(/^["'“‘](.*)["'”’]$/, '$1').trim();

  let artist = '';
  let songTitle = '';

  // 3. Check for standard separators: "Artist - Title", "Artist – Title", "Artist : Title", "Artist | Title"
  const separatorMatch = workingTitle.match(/^(.*?)\s*[-–—:|•]\s*(.*)$/);

  if (separatorMatch) {
    const rawArtist = separatorMatch[1].trim();
    const rawTitle = separatorMatch[2].trim();

    // Check if the title part contains "by"
    if (rawTitle.toLowerCase().includes(' by ')) {
      const byParts = rawTitle.split(/\s+by\s+/i);
      songTitle = byParts[0].trim();
      artist = byParts[1].trim();
    } else {
      artist = rawArtist;
      songTitle = rawTitle;
    }
  } else if (workingTitle.toLowerCase().includes(' by ')) {
    // "Title by Artist"
    const byParts = workingTitle.split(/\s+by\s+/i);
    songTitle = byParts[0].trim();
    artist = byParts[1].trim();
  } else {
    // No separator found: Assume the workingTitle is the track name, fallback artist is cleaned channelTitle
    songTitle = workingTitle;
    artist = cleanChannelName(channelTitle);
  }

  // 4. Second pass noise filter on song title and artist separately
  for (const regex of NOISE_REGEXES) {
    songTitle = songTitle.replace(regex, ' ');
    artist = artist.replace(regex, ' ');
  }

  // 5. Strip feature artists from song title for a cleaner primary search query
  let cleanedSongTitle = songTitle;
  for (const featRegex of FEAT_REGEXES) {
    cleanedSongTitle = cleanedSongTitle.replace(featRegex, ' ');
  }

  // Clean artist: remove ft / feat from artist field as well
  let cleanedArtist = artist;
  for (const featRegex of FEAT_REGEXES) {
    cleanedArtist = cleanedArtist.replace(featRegex, ' ');
  }

  // 6. Final whitespace normalization and strip leftover brackets or punctuation
  cleanedSongTitle = cleanedSongTitle
    .replace(/[,\-_./|]+$/, '')
    .replace(/^[,\-_./|]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  cleanedArtist = cleanChannelName(cleanedArtist)
    .replace(/[,\-_./|]+$/, '')
    .replace(/^[,\-_./|]+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Fallback: If artist ended up blank, use channel title
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
 */
export function buildSpotifySearchQueries(cleaned: CleanedTrackMetadata): {
  strictQuery: string;
  fallbackQuery: string;
  broadQuery: string;
} {
  const cleanTitleNoSpecial = cleaned.cleanedTitle.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  const cleanArtistNoSpecial = cleaned.cleanedArtist.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();

  // Strict structured query: track:X artist:Y
  const strictQuery = `track:${cleanTitleNoSpecial} artist:${cleanArtistNoSpecial}`;

  // Fallback combined query: "Song Artist"
  const fallbackQuery = `${cleanTitleNoSpecial} ${cleanArtistNoSpecial}`.trim();

  // Broad query: just song title
  const broadQuery = cleanTitleNoSpecial;

  return {
    strictQuery,
    fallbackQuery,
    broadQuery,
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
