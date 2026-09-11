'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, RefreshCcw, Trash2, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full ios-btn bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to PlaylistBridge</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-[28px] ios-bubble-card space-y-6 border border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy & Data Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Effective Date: September 10, 2026 | Application: PlaylistBridge</p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>1. Overview and Purpose</span>
              </h2>
              <p>
                PlaylistBridge ("we", "our", or "the Service"), created by RuBiQ (Abhishek Nautiyal), is a utility tool designed to help users transfer, migrate, and synchronize their music playlists between supported music streaming platforms, including YouTube Music, Spotify, Amazon Music, and JioSaavn.
              </p>
              <p>
                We believe in strict data minimization: we only request the bare minimum permissions necessary to read your playlists from your source provider and recreate them on your destination provider.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>2. Information We Access and How It Is Used</span>
              </h2>
              <p>
                When you authenticate your music accounts through official OAuth 2.0 protocols, we access:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li><strong>YouTube Data API (Scope: <code>youtube.readonly</code>)</strong>: We access your playlist names, descriptions, and the list of tracks (song titles and artist names) contained in the playlists you select for migration.</li>
                <li><strong>Spotify Web API</strong>: We access your user profile ID, display name, and existing playlists to create the migrated playlist and insert matching tracks on your behalf.</li>
                <li><strong>Account Metadata</strong>: Display name and avatar image URL solely to display your active connection status in the header.</li>
              </ul>
              <p className="text-emerald-400/90 font-medium">
                ✓ We do NOT access your passwords, emails, private messages, contacts, payment details, or personal search history.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>3. Data Storage, Security, and Retention</span>
              </h2>
              <p>
                We prioritize industry-standard security practices:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li><strong>Zero Persistent Database</strong>: PlaylistBridge does not operate a permanent database of your songs, listening history, or library.</li>
                <li><strong>Encrypted Ephemeral Cookies</strong>: OAuth authorization tokens are encrypted using military-grade <code>AES-256-GCM</code> encryption and stored in temporary, HTTP-only, secure browser session cookies.</li>
                <li><strong>HTTPS/TLS 1.3</strong>: All network traffic between your browser and our servers is encrypted in transit using modern TLS certificates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-emerald-400" />
                <span>4. Google API Services User Data Policy & Limited Use Disclosure</span>
              </h2>
              <p className="bg-slate-900/90 border border-white/10 p-3.5 rounded-2xl text-slate-200">
                PlaylistBridge's use and transfer to any other app of information received from Google APIs adheres to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline font-semibold hover:text-emerald-300"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <p>
                Specifically, Google user data is strictly used to provide the user-facing playlist migration functionality and is never transferred to third parties for advertising, retargeting, or data broker purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-400" />
                <span>5. User Rights and How to Revoke Access</span>
              </h2>
              <p>
                You retain complete control over your music accounts at all times:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li><strong>In-App Disconnect</strong>: You can click the "Disconnect / Logout" button on the platform selector at any time to immediately wipe the encrypted session cookies from your browser.</li>
                <li><strong>Google Permissions</strong>: You can revoke PlaylistBridge's access at any time through your{' '}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline hover:text-emerald-300"
                  >
                    Google Account Security & Third-Party Permissions
                  </a>.
                </li>
                <li><strong>Spotify Permissions</strong>: You can revoke access through your{' '}
                  <a
                    href="https://www.spotify.com/account/apps/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline hover:text-emerald-300"
                  >
                    Spotify Account Apps Overview
                  </a>.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">6. Sharing of Information</h2>
              <p>
                We do not sell, rent, lease, or monetize your personal information to third parties, advertising networks, or analytics brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">7. Contact Information</h2>
              <p>
                For questions, feedback, or data privacy requests, you can contact the developer directly at:
              </p>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/10 font-mono text-xs text-emerald-400">
                Developer Contact: abhisheknautiyal509@gmail.com
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
