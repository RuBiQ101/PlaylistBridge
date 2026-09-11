import { CleanedTrackMetadata } from './types';

// Prefix noise to strip from start of titles
const PREFIX_NOISE_REGEX =
  /^(?:(?:full\s+)?video(?:\s+song)?|official\s+(?:music\s+)?video|lyrical(?:\s+video)?|mashup(?:\s+video)?|audio(?:\s+song)?|lyrics?)\s*[:\-–—|•]\s*/i;

// Noise tags to strip
const NOISE_REGEXES = [
  /\s*[\(\[]\s*[^)\]]*(official|music\s*video|audio|video|lyrics?|lyrical|hd|4k|8k|remaster|visualizer|mix|ver(\.|\b)|version|prod|explicit|clean|clip|soundtrack|ost|live|session|edit|remix|hq|hq audio|uhd|full\s*song|full\s*video|promo|teaser|song)[^)\]]*[\)\]]/gi,
  /\s*\[\s*(mv|m\/v|pv|hq|hd|4k|8k|audio|lyrics?|official|explicit|clean|visualizer|topic|full\s*song)\s*\]/gi,
  /\s*[-–—|•/]\s*official\s*(music\s*)?(video|audio|visualizer|lyric\s*video|lyrical\s*video)?\s*$/gi,
  /\s*[-–—|•/]\s*(music\s*video|lyric\s*video|lyrical\s*video|audio\s*video|official\s*hd|4k\s*video|full\s*video\s*song|full\s*video|full\s*song|lyrical)\s*$/gi,
  /\s*[-–—|•/]\s*(video\s*song|audio\s*song|video|audio)\s*$/gi,
];

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
 * Checks if a string segment is purely metadata noise (like "Official Video", "2023", "Full Song", etc.)
 */
function isNoiseSegment(text: string): boolean {
  const t = text.trim();
  if (t.length <= 1) return true;
  return /^(official(\s+video|\s+song)?|video|audio|lyric|lyrics|lyrical(\s+video)?|full\s*song|full\s*video|hd|4k|promo|teaser|song|music|records|cassettes|\d{4}|\d{1,2}(st|nd|rd|th)?\s+[a-z]+\s+\d{4}|latest\s+[a-z\s]+song|#\w+|special\s+track)$/i.test(
    t
  );
}

/**
 * Core Track Normalization Function
 * Handles Western formats (Artist - Song), Indian formats (Song - Movie | Singer | Actor),
 * and multilingual titles without losing song identity.
 */
export function cleanTrackMetadata(
  title: string,
  channelTitle: string = '',
  rawDurationSec?: number
): CleanedTrackMetadata {
  const originalTitle = title || '';
  let workingTitle = originalTitle.trim();

  // 1. Remove outer quotes
  workingTitle = workingTitle.replace(/^["'“‘](.*)["'”’]$/, '$1').trim();

  // 2. Remove common prefixes like "Full Video: ", "Lyrical: ", "Video Song: "
  workingTitle = workingTitle.replace(PREFIX_NOISE_REGEX, '').trim();

  // 3. Remove bracketed noise
  for (const regex of NOISE_REGEXES) {
    workingTitle = workingTitle.replace(regex, ' ');
  }

  // 4. Split into segments using major delimiters (||, |, //, -, –, —)
  const rawSegments = workingTitle
    .split(/\s*(?:\|\||\||\/\/|\/|[-–—:])\s*/)
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && !isNoiseSegment(s));

  let songTitle = '';
  let artist = '';

  if (rawSegments.length >= 2) {
    const seg0 = rawSegments[0];
    const seg1 = rawSegments[1];

    // Check if seg0 is likely Artist and seg1 is Song (Western style: "Imagine Dragons - Bad Liar")
    // Or seg0 is Song and seg1 is Movie/Artist (Indian style: "Maiyya Mainu - Jersey")
    // We set primary songTitle to seg0 and artist to seg1 (or cleaned channelTitle if seg1 is movie/actor)
    songTitle = seg0;
    artist = seg1;

    // If channelTitle is clearly an artist and seg1 is an actor or movie, channelTitle can help
    const cleanedChannel = cleanChannelName(channelTitle);
    if (cleanedChannel && !/t-series|zee music|sony music|speed records|tips|yrf/i.test(cleanedChannel)) {
      // If channel is an indie artist (e.g. "Arpit Shikhar", "Inder Arya", "Rohit Chauhan"), use channel as artist
      artist = cleanedChannel;
    }
  } else if (rawSegments.length === 1) {
    songTitle = rawSegments[0];
    artist = cleanChannelName(channelTitle);
  } else {
    songTitle = workingTitle;
    artist = cleanChannelName(channelTitle);
  }

  // 5. Clean extra noise from songTitle
  for (const regex of NOISE_REGEXES) {
    songTitle = songTitle.replace(regex, ' ');
  }
  for (const featRegex of FEAT_REGEXES) {
    songTitle = songTitle.replace(featRegex, ' ');
  }

  // 6. Clean artist
  for (const featRegex of FEAT_REGEXES) {
    artist = artist.replace(featRegex, ' ');
  }

  // Final trim
  songTitle = songTitle.replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ').replace(/\s+/g, ' ').trim();
  artist = artist.replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ').replace(/\s+/g, ' ').trim();

  if (!artist && channelTitle) {
    artist = cleanChannelName(channelTitle);
  }

  return {
    originalTitle,
    channelTitle,
    cleanedTitle: songTitle || workingTitle,
    cleanedArtist: artist || 'Unknown Artist',
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

  // 1. Primary queries
  const strictQuery = !isGenericArtist
    ? `track:${cleanTitle} artist:${cleanArtist}`
    : cleanTitle;

  const fallbackQuery = !isGenericArtist
    ? `${cleanTitle} ${cleanArtist}`.trim()
    : cleanTitle;

  const broadQuery = cleanTitle;

  // 2. Extract clean individual segments from originalTitle
  const alternateQueries: string[] = [];
  const seenQueries = new Set<string>([strictQuery.toLowerCase(), fallbackQuery.toLowerCase(), broadQuery.toLowerCase()]);

  // Strip prefixes like "Full Video: ", "Queen: ", "Lyrical: "
  const strippedOrig = cleaned.originalTitle
    .replace(/^(?:(?:full\s+)?video(?:\s+song)?|official\s+(?:music\s+)?video|lyrical(?:\s+video)?|mashup(?:\s+video)?|audio(?:\s+song)?|lyrics?)\s*[:\-–—|•]\s*/i, '')
    .trim();

  // Split by major dividers (||, |, -, –, —, :, /)
  const segments = strippedOrig
    .split(/\s*(?:\|\||\||\/\/|\/|[-–—:])\s*/)
    .map((s: string) =>
      s
        .replace(NOISE_REGEXES[0], ' ')
        .replace(NOISE_REGEXES[1], ' ')
        .replace(NOISE_REGEXES[2], ' ')
        .replace(NOISE_REGEXES[3], ' ')
        .replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((s: string) => s.length >= 2 && !isNoiseSegment(s));

  if (segments.length >= 2) {
    // Segment 0 + Segment 1 (e.g. "Maiyya Mainu Jersey" or "Bad Liar Imagine Dragons")
    const combo01 = `${segments[0]} ${segments[1]}`.trim();
    if (!seenQueries.has(combo01.toLowerCase())) {
      alternateQueries.push(combo01);
      seenQueries.add(combo01.toLowerCase());
    }

    // Segment 1 + Segment 0 (e.g. "Imagine Dragons Bad Liar" or "Pritam Tera Deedar Hua")
    const combo10 = `${segments[1]} ${segments[0]}`.trim();
    if (!seenQueries.has(combo10.toLowerCase())) {
      alternateQueries.push(combo10);
      seenQueries.add(combo10.toLowerCase());
    }

    // Just Segment 0 (e.g. "Maiyya Mainu" or "Namo Namo" or "Hookah Bar")
    if (!seenQueries.has(segments[0].toLowerCase())) {
      alternateQueries.push(segments[0]);
      seenQueries.add(segments[0].toLowerCase());
    }

    // Just Segment 1 (e.g. "Bad Liar" or "London Thumakda")
    if (!seenQueries.has(segments[1].toLowerCase())) {
      alternateQueries.push(segments[1]);
      seenQueries.add(segments[1].toLowerCase());
    }
  }

  // Devanagari / Regional script check
  const regionalParts = cleaned.originalTitle
    .split(/[,!|–—\-]/)
    .map((p: string) => p.replace(/["'()\[\]{},.!|/\\:;?*~#@$%^&+=<>_]/g, ' ').trim())
    .filter((p: string) => p.length > 3);

  for (const part of regionalParts) {
    if (!seenQueries.has(part.toLowerCase())) {
      alternateQueries.push(part);
      seenQueries.add(part.toLowerCase());
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
