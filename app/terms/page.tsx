'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

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
              <span>Terms of Service & Usage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
            <p className="text-xs text-slate-400">Effective Date: September 10, 2026 | Application: PlaylistBridge</p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Agreement to Terms</h2>
              <p>
                By accessing or using PlaylistBridge ("the Service"), operated by RuBiQ (Abhishek Nautiyal), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree, you must immediately discontinue using the Service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Permitted Use and Account Responsibility</h2>
              <p>
                PlaylistBridge is provided strictly for personal, non-commercial use to assist users in transferring their legitimately owned playlists and favorite music tracks between supported platforms. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>Only connect accounts that you personally own and are authorized to access.</li>
                <li>Not use the Service to spam, scrape, overload, or disrupt third-party music streaming APIs.</li>
                <li>Comply with all applicable local, national, and international laws regarding intellectual property and digital content.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Third-Party Platforms and Non-Affiliation</h2>
              <p>
                PlaylistBridge operates via public and developer API integrations with third-party services, including Google/YouTube, Spotify, Amazon Music, and JioSaavn.
              </p>
              <p className="bg-slate-900/90 border border-white/10 p-3.5 rounded-2xl text-slate-200">
                <strong>Non-Affiliation Notice</strong>: PlaylistBridge is an independent open utility tool and is NOT affiliated with, sponsored, endorsed, or partnered with Google LLC, YouTube, Spotify AB, Amazon.com, Inc., or Reliance Jio. All trademarks, service marks, logos, and artist rights remain the exclusive property of their respective owners.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. YouTube & Spotify API Terms Compliance</h2>
              <p>
                By utilizing PlaylistBridge to connect your YouTube or Spotify accounts, you expressly agree to be bound by:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                <li>
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">
                    YouTube Terms of Service
                  </a>
                </li>
                <li>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">
                    Google Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://www.spotify.com/legal/end-user-agreement/" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">
                    Spotify End User Agreement
                  </a>
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">5. Matching Algorithm and Catalog Disclaimers</h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. While our track title cleaning and catalog matching algorithms employ duration tolerance checks (±12s), we cannot guarantee 100% catalog availability, as certain songs, remixes, or regional licenses may not exist on all target platforms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, in no event shall the developer or contributors of PlaylistBridge be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">7. Contact & Inquiries</h2>
              <p>
                For any inquiries, contact:
              </p>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/10 font-mono text-xs text-emerald-400">
                Email: abhisheknautiyal509@gmail.com
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
