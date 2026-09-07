export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  itemCount: number;
  channelTitle: string;
}

export interface YouTubeTrack {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl?: string;
  durationSec?: number; // Estimated or fetched from contentDetails
  videoOwnerChannelTitle?: string;
}

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

export type TrackMatchStatus = 'MATCHED' | 'UNMATCHED' | 'SEARCHING' | 'SKIPPED' | 'ADDED';

export interface TrackReconciliation {
  index: number;
  sourceTrack: YouTubeTrack;
  cleaned: CleanedTrackMetadata;
  status: TrackMatchStatus;
  spotifyTrack?: SpotifyTrackResult;
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
    | 'CREATING_SPOTIFY_PLAYLIST'
    | 'ADDING_TRACKS'
    | 'COMPLETE'
    | 'LOG'
    | 'ERROR';
  playlistId: string;
  playlistTitle?: string;
  totalTracks: number;
  currentIndex: number;
  matchedCount: number;
  unmatchedCount: number;
  currentTrack?: TrackReconciliation;
  spotifyPlaylistUrl?: string;
  spotifyPlaylistId?: string;
  message: string;
  logLevel?: 'info' | 'success' | 'warn' | 'error';
}

export interface PlatformAuthStatus {
  spotify: {
    connected: boolean;
    userId?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  youtube: {
    connected: boolean;
    channelTitle?: string;
    avatarUrl?: string;
  };
  isDemoMode: boolean;
}

export interface MigrationSummary {
  originalPlaylist: YouTubePlaylist;
  spotifyPlaylistId: string;
  spotifyPlaylistUrl: string;
  spotifyPlaylistName: string;
  totalTracks: number;
  matchedCount: number;
  unmatchedCount: number;
  durationMs: number;
  tracks: TrackReconciliation[];
}
