'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

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
            <p className="text-xs text-slate-400">Last updated: September 10, 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>1. Overview</span>
              </h2>
              <p>
                PlaylistBridge ("we", "our") is designed to transfer music playlists between streaming platforms (YouTube Music, Spotify, Amazon Music). We respect your privacy and prioritize data minimization.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>2. Information We Access</span>
              </h2>
              <p>
                When you connect an account, we request standard read-only access (such as <code>youtube.readonly</code> and Spotify <code>playlist-read-private</code>) strictly to read your playlists, track titles, and artist names.
              </p>
              <p>
                We do <strong>not</strong> access your emails, personal contacts, search history, payment information, or passwords.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>3. Data Storage & Retention</span>
              </h2>
              <p>
                OAuth tokens are encrypted using industry-standard AES-256-GCM encryption and stored securely in temporary session cookies on your device. We do not maintain a permanent external database of your listening history or library.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. Google API Services User Data Policy</h2>
              <p>
                PlaylistBridge's use and transfer to any other app of information received from Google APIs adheres to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline hover:text-emerald-300"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">5. Contact</h2>
              <p>
                If you have questions regarding this policy, contact us at:{' '}
                <span className="text-white font-mono">abhisheknautiyal509@gmail.com</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
