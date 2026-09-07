import { cleanTrackMetadata, buildSpotifySearchQueries, isDurationValid } from './normalization';

const testCases = [
  {
    input: "The Weeknd - Blinding Lights (Official Music Video)",
    channel: "TheWeekndVEVO",
    durationSec: 260,
    expectedTitle: "Blinding Lights",
    expectedArtist: "The Weeknd",
  },
  {
    input: "Daft Punk ft. Pharrell Williams - Get Lucky [HD Audio]",
    channel: "Daft Punk - Topic",
    durationSec: 248,
    expectedTitle: "Get Lucky",
    expectedArtist: "Daft Punk",
  },
  {
    input: "Never Gonna Give You Up (Official 4K Remastered)",
    channel: "Rick Astley",
    durationSec: 213,
    expectedTitle: "Never Gonna Give You Up",
    expectedArtist: "Rick Astley",
  },
  {
    input: "Queen - Bohemian Rhapsody (2011 Remaster) [Official Video]",
    channel: "Queen Official",
    durationSec: 355,
    expectedTitle: "Bohemian Rhapsody",
    expectedArtist: "Queen",
  },
  {
    input: "Starboy by The Weeknd feat. Daft Punk (Lyric Video)",
    channel: "Top Hits",
    durationSec: 230,
    expectedTitle: "Starboy",
    expectedArtist: "The Weeknd",
  },
  {
    input: "Billie Eilish - bad guy (Audio / Visualizer)",
    channel: "Billie Eilish",
    durationSec: 194,
    expectedTitle: "bad guy",
    expectedArtist: "Billie Eilish",
  },
  {
    input: "Midnight City",
    channel: "M83 - Topic",
    durationSec: 243,
    expectedTitle: "Midnight City",
    expectedArtist: "M83",
  },
];

console.log("=== Testing PlaylistBridge Track Normalization Engine ===\n");

let passed = 0;
for (const tc of testCases) {
  const result = cleanTrackMetadata(tc.input, tc.channel, tc.durationSec);
  const queries = buildSpotifySearchQueries(result);
  const durCheck = isDurationValid(tc.durationSec * 1000 + 4000, tc.durationSec, 12);

  const titleMatch = result.cleanedTitle.toLowerCase() === tc.expectedTitle.toLowerCase();
  const artistMatch = result.cleanedArtist.toLowerCase() === tc.expectedArtist.toLowerCase();

  if (titleMatch && artistMatch) {
    console.log(`✅ PASS: "${tc.input}"`);
    console.log(`   ➔ Title: "${result.cleanedTitle}" | Artist: "${result.cleanedArtist}"`);
    console.log(`   ➔ Strict Query: "${queries.strictQuery}"`);
    console.log(`   ➔ Duration Check (+4s diff): valid=${durCheck.valid}, diff=${durCheck.diffSec}s\n`);
    passed++;
  } else {
    console.error(`❌ FAIL: "${tc.input}"`);
    console.error(`   Got: Title="${result.cleanedTitle}", Artist="${result.cleanedArtist}"`);
    console.error(`   Expected: Title="${tc.expectedTitle}", Artist="${tc.expectedArtist}"\n`);
  }
}

console.log(`\nResults: ${passed}/${testCases.length} test cases passed.`);
if (passed === testCases.length) {
  console.log("All normalization unit tests passed successfully!");
}
