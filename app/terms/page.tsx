'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
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
              <FileText className="w-3.5 h-3.5" />
              <span>User Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: September 10, 2026</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By using PlaylistBridge, you agree to these Terms of Service. If you do not agree, you may discontinue use at any time.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Service Description</h2>
              <p>
                PlaylistBridge is an open utility that reads playlist metadata from one music provider (YouTube Music) and finds corresponding songs on another provider (Spotify, Amazon Music) to automate personal library transfers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Third-Party Services</h2>
              <p>
                PlaylistBridge interacts with third-party APIs (Google/YouTube, Spotify, Amazon). Your use of these platforms is subject to their respective Terms of Service:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li><a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">YouTube Terms of Service</a></li>
                <li><a href="https://www.spotify.com/legal/end-user-agreement/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Spotify Terms of Service</a></li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. Disclaimer & Limitations</h2>
              <p>
                The service is provided "as is" without warranty. While our track matching algorithm strives for high accuracy, song availability and duration tolerances depend on catalog availability.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
