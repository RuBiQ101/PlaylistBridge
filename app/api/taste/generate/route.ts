import { NextRequest, NextResponse } from 'next/server';
import { generateTastePlaylist, analyzeLibraryTracks } from '@/lib/analyser';
import { GenericTrack, TasteAnalysisResult, TastePlaylistOptions } from '@/lib/types';
import { MOCK_SPOTIFY_PLAYLIST_TRACKS, MOCK_YOUTUBE_TRACKS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let tracks: GenericTrack[] = body.tracks || [];
    let analysis: TasteAnalysisResult = body.analysis;
    const options: TastePlaylistOptions = body.options || {
      preset: 'balanced',
      trackCount: 25,
    };

    if (!tracks || tracks.length === 0) {
      tracks = [
        ...Object.values(MOCK_YOUTUBE_TRACKS).flat(),
        ...Object.values(MOCK_SPOTIFY_PLAYLIST_TRACKS).flat(),
      ];
    }


    if (!analysis) {
      analysis = analyzeLibraryTracks(tracks);
    }

    const playlist = generateTastePlaylist(tracks, analysis, options);

    return NextResponse.json({ playlist });
  } catch (error: any) {
    console.error('Taste playlist generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate taste playlist' },
      { status: 500 }
    );
  }
}
