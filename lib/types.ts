export type PlatformId =
  | 'youtube'
  | 'spotify'
  | 'amazon'
  | 'jiosaavn';

export interface GenericPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  channelTitle?: string;
  ownerTitle?: string;
  platform?: PlatformId;
}

export type YouTubePlaylist = GenericPlaylist;
export type SpotifyPlaylist = GenericPlaylist;

export interface GenericTrack {
  id: string;
  title: string;
  artist?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  durationMs?: number;
  videoOwnerChannelTitle?: string;
  uri?: string;
  url?: string;
}

export type YouTubeTrack = GenericTrack;

export interface CleanedTrackMetadata {
  originalTitle: string;
  channelTitle: string;
  cleanedTitle: string;
  cleanedArtist: string;
  rawDurationSec?: number;
}

export interface SpotifyTrackResult {
  id: string;
  name: string;
  artist: string;
  artists: string[];
  albumName: string;
  albumImageUrl?: string;
  uri: string;
  durationMs: number;
  durationSec: number;
  spotifyUrl: string;
  matchScore?: number;
  durationDiffSec?: number;
}

export interface YouTubeTrackResult {
  id: string;
  name: string;
  artist: string;
  channelTitle: string;
  thumbnailUrl?: string;
  durationSec: number;
  url: string;
  matchScore?: number;
  durationDiffSec?: number;
}

export interface GenericTrackResult {
  id: string;
  name: string;
  artist: string;
  albumName?: string;
  thumbnailUrl?: string;
  durationSec: number;
  durationMs?: number;
  url: string;
  uri?: string;
  platform?: PlatformId;
  durationDiffSec?: number;
}

export type TrackMatchStatus = 'MATCHED' | 'UNMATCHED' | 'SEARCHING' | 'SKIPPED' | 'ADDED';

export interface TrackReconciliation {
  index: number;
  sourceTrack: GenericTrack;
  cleaned: CleanedTrackMetadata;
  status: TrackMatchStatus;
  spotifyTrack?: SpotifyTrackResult;
  youtubeTrack?: YouTubeTrackResult;
  targetTrackTitle?: string;
  targetTrackArtist?: string;
  targetTrackUrl?: string;
  targetDurationDiffSec?: number;
  reason?: string;
  timestamp: string;
}

export interface MigrationProgressEvent {
  type:
    | 'INIT'
    | 'FETCHING_SOURCE'
    | 'TRACK_SEARCHING'
    | 'TRACK_MATCHED'
    | 'TRACK_UNMATCHED'
    | 'CREATING_TARGET_PLAYLIST'
    | 'CREATING_SPOTIFY_PLAYLIST'
    | 'ADDING_TRACKS'
    | 'COMPLETE'
    | 'LOG'
    | 'ERROR';
  playlistId: string;
  playlistTitle?: string;
  sourcePlatform?: PlatformId;
  targetPlatform?: PlatformId;
  totalTracks: number;
  currentIndex: number;
  matchedCount: number;
  unmatchedCount: number;
  currentTrack?: TrackReconciliation;
  targetPlaylistUrl?: string;
  targetPlaylistId?: string;
  spotifyPlaylistUrl?: string;
  spotifyPlaylistId?: string;
  message: string;
  logLevel?: 'info' | 'success' | 'warn' | 'error';
}

export interface PlatformAccountDetails {
  connected: boolean;
  userId?: string;
  displayName?: string;
  channelTitle?: string;
  avatarUrl?: string;
}

export interface PlatformAuthStatus {
  spotify: PlatformAccountDetails;
  youtube: PlatformAccountDetails;
  amazon?: PlatformAccountDetails;
  jiosaavn?: PlatformAccountDetails;
  isDemoMode: boolean;
}

export interface MigrationSummary {
  originalPlaylist: GenericPlaylist;
  targetPlaylistId: string;
  targetPlaylistUrl: string;
  targetPlaylistName: string;
  sourcePlatform: PlatformId;
  targetPlatform: PlatformId;
  spotifyPlaylistId?: string;
  spotifyPlaylistUrl?: string;
  spotifyPlaylistName?: string;
  totalTracks: number;
  matchedCount: number;
  unmatchedCount: number;
  durationMs: number;
  tracks: TrackReconciliation[];
}

export interface ArtistTasteStat {
  name: string;
  count: number;
  percentage: number;
  primaryGenre: string;
}

export interface GenreTasteStat {
  genre: string;
  count: number;
  percentage: number;
  color: string;
  badge: string;
}

export interface MoodDistribution {
  upbeatParty: number;     // % high tempo / energetic
  chillAmbient: number;    // % relaxing / ambient
  soulfulMelodic: number;  // % melodic / emotional / acoustic
  intenseFocus: number;    // % intense / dark / workout
}

export interface EraStat {
  decade: string;
  percentage: number;
}

export interface TasteAnalysisResult {
  totalTracksScanned: number;
  uniqueTracksCount: number;
  uniqueArtistsCount: number;
  topArtists: ArtistTasteStat[];
  genreBreakdown: GenreTasteStat[];
  topGenres: string[];
  moodDistribution: MoodDistribution;
  eraDistribution: EraStat[];
  diversityScore: number; // 0 to 100
  tasteTitle: string;     // e.g. "Eclectic Sonic Explorer"
  summaryDescription: string;
  scannedPlaylistsCount: number;
}

export type TastePreset = 'balanced' | 'high_energy' | 'chill' | 'eclectic';

export interface TastePlaylistOptions {
  preset: TastePreset;
  trackCount: number;
  customTitle?: string;
}

export interface TasteTrackItem extends GenericTrack {
  styleTag: string;
  vibeTag: string;
}

export interface GeneratedTastePlaylist extends GenericPlaylist {
  tracks: TasteTrackItem[];
  stylesCovered: string[];
  presetUsed: TastePreset;
}

