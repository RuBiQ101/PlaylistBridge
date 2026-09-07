# PlaylistBridge 🎵 ➔ 🎧

> **High-Performance Playlist Migration from YouTube Music to Spotify**
> Built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Server-Sent Events (SSE) streaming.

---

## ✨ Features

- **OAuth 2.0 PKCE & Auth Code Flows**:
  - **Spotify**: `playlist-read-private`, `playlist-modify-public`, `playlist-modify-private`, `user-library-modify`.
  - **YouTube Data API v3**: `https://www.googleapis.com/auth/youtube.readonly`.
- **Intelligent Track Normalization Engine**:
  - Automatically strips YouTube video noise (`(Official Music Video)`, `[HD Audio]`, `(Remastered)`, `(Lyric Video)`, `feat.`, `ft.`, `[MV]`, `VEVO`, etc.).
  - Separates artist from song title (`Artist - Title`, `Title by Artist`, `Artist : Title`).
  - Fallback to channel title (stripping `- Topic`, `Official`, etc.).
- **Spotify Matching & Duration Verification (±12s)**:
  - Multi-tier search: Strict query (`track:X artist:Y`) ➔ Combined fallback ➔ Broad song search.
  - Duration comparison against source video with strict ±12s threshold tolerance to prevent mismatched live versions or extended mixes.
- **Real-Time Live SSE Stream**:
  - Live progress bar, KPI metric counters (Total, Matched, Unmatched).
  - Terminal-style live log displaying normalized queries and match events.
- **Batch Playlist Population**:
  - Creates `[Migrated] <Original Playlist Name>` on Spotify.
  - Adds matched Spotify track URIs in chunks of 100 via Spotify Web API.
- **Summary & Reconciliation Export**:
  - Match rate celebration & direct "Open in Spotify" button.
  - Interactive, searchable & filterable table of all tracks with status & reasons.
  - One-click CSV export of the full reconciliation report.
- **Zero-Config Demo / Mock Mode**:
  - Test the entire end-to-end migration pipeline with realistic mock data without entering live API credentials.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Live Mode)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
- **Spotify Developer Dashboard**: Create an app and set Redirect URI to `http://localhost:3000/api/auth/spotify/callback`.
- **Google Cloud Console**: Enable YouTube Data API v3 and set Authorized redirect URI to `http://localhost:3000/api/auth/youtube/callback`.

*(If credentials are not provided, PlaylistBridge automatically operates in Demo Mode for instant testing).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Normalization

Run the automated track normalization test suite:
```bash
npx tsx lib/test-normalization.ts
```
