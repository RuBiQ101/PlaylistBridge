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

---

---

## 🌐 Deploying to Render with a Custom Domain

PlaylistBridge is fully configured for 1-click deployment on **Render** as a Node.js Web Service with automatic SSL certificates.

### Step 1: Deploy on Render
1. Push your code to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** ➔ **Blueprint** (or **Web Service**).
4. Connect your `PlaylistBridge` repository.
5. Render will automatically detect `render.yaml` and configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/auth/status`

### Step 2: Attach Your Custom Domain
1. In your Render Web Service dashboard, go to **Settings** ➔ **Custom Domains**.
2. Click **Add Custom Domain** and enter your domain (e.g. `playlistbridge.com` or `app.yourdomain.com`).
3. In your domain registrar (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.), add the DNS records provided by Render:
   - For a subdomain (e.g., `app.yourdomain.com`): Add a **CNAME** pointing to your Render URL (`playlistbridge.onrender.com`).
   - For apex domain (e.g., `yourdomain.com`): Add an **A record** pointing to Render's IP address (`216.24.57.1`).
4. Render will automatically provision a free Let's Encrypt **SSL Certificate** (HTTPS).

### Step 3: Set Environment Variables on Render
Under the **Environment** tab on Render, configure:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/auth/spotify/callback

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/youtube/callback

AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret
AMAZON_REDIRECT_URI=https://yourdomain.com/api/auth/amazon/callback
```

### Step 4: Add Redirect URIs in Developer Consoles
Add your production URLs to the respective developer consoles:
- **Spotify Developer Dashboard**: Add `https://yourdomain.com/api/auth/spotify/callback` to *Redirect URIs*.
- **Google Cloud Console**: Add `https://yourdomain.com/api/auth/youtube/callback` to *Authorized redirect URIs*.
- **Amazon Developer Console**: Add `https://yourdomain.com/api/auth/amazon/callback` to *Allowed Return URLs*.

---

## 📄 License & Copyright

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

**Copyright © 2026 RuBiQ (Abhishek Nautiyal). All rights reserved.**

