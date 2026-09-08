'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  Zap,
  Key,
  Link as LinkIcon,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';
import { PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

interface AccountLinkModalProps {
  platformId: PlatformId | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccountLinkModal: React.FC<AccountLinkModalProps> = ({
  platformId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !platformId) return null;

  const config = PLATFORMS_CONFIG[platformId] || PLATFORMS_CONFIG.youtube;

  // Form states
  const [activeTab, setActiveTab] = useState<'quick' | 'profile' | 'token'>('quick');
  const [displayName, setDisplayName] = useState<string>(`${config.name} Member`);
  const [profileUrlOrHandle, setProfileUrlOrHandle] = useState<string>('');
  const [customToken, setCustomToken] = useState<string>('');
  const [membershipTier, setMembershipTier] = useState<string>('Premium / VIP');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Platform specific preset suggestions
  const presets: Record<PlatformId, { tiers: string[]; defaultHandle: string; urlPlaceholder: string }> = {
    youtube: {
      tiers: ['YouTube Premium', 'YouTube Music Subscriber', 'Standard Account'],
      defaultHandle: '@music_creator',
      urlPlaceholder: 'https://music.youtube.com/channel/UC...',
    },
    spotify: {
      tiers: ['Spotify Premium', 'Spotify Duo/Family', 'Spotify Free'],
      defaultHandle: 'spotify_user_2026',
      urlPlaceholder: 'https://open.spotify.com/user/...',
    },
    apple: {
      tiers: ['Apple Music Individual', 'Apple Music Family', 'Apple One Premier'],
      defaultHandle: 'apple_music_listener',
      urlPlaceholder: 'https://music.apple.com/profile/...',
    },
    amazon: {
      tiers: ['Amazon Music Unlimited', 'Amazon Prime Music', 'Amazon Music HD'],
      defaultHandle: 'amazon_music_fan',
      urlPlaceholder: 'https://music.amazon.com/profiles/...',
    },
    jiosaavn: {
      tiers: ['JioSaavn Pro', 'JioSaavn VIP', 'JioMusic Member'],
      defaultHandle: 'jiosaavn_pro_listener',
      urlPlaceholder: 'https://www.jiosaavn.com/user/...',
    },
    soundcloud: {
      tiers: ['SoundCloud Go+', 'SoundCloud Next Pro', 'SoundCloud Free'],
      defaultHandle: 'soundcloud_producer',
      urlPlaceholder: 'https://soundcloud.com/your-artist-name',
    },
    tidal: {
      tiers: ['TIDAL HiFi Plus (FLAC/Master)', 'TIDAL HiFi', 'TIDAL Individual'],
      defaultHandle: 'tidal_audiophile',
      urlPlaceholder: 'https://listen.tidal.com/user/...',
    },
  };

  const currentPreset = presets[platformId] || presets.jiosaavn;

  const handleQuickLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/auth/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformId,
          displayName: displayName.trim() || `${config.name} User`,
          userId: profileUrlOrHandle.trim() || `user_${Date.now().toString(36)}`,
          tier: membershipTier,
          token: customToken.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to link account');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error linking account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-slate-900 border ${config.borderColor} shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Modal Header */}
        <div className={`p-6 bg-gradient-to-r ${config.bgColor} to-slate-900 border-b border-slate-800/80 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-slate-950/80 border ${config.borderColor} flex items-center justify-center shadow-lg font-bold text-white`}>
              <Sparkles className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Link {config.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 ${config.color} border border-slate-700`}>
                  Universal Link
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connect your profile for playlist import, matching & sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Method Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'quick'
                ? `border-emerald-500 text-white`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Instant Link</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? `border-emerald-500 text-white`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Profile / URL</span>
          </button>

          <button
            onClick={() => setActiveTab('token')}
            className={`flex items-center gap-1.5 pb-3 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'token'
                ? `border-emerald-500 text-white`
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span>Custom Token / Key</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleQuickLink} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Connect Mode */}
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Account Display Name / Alias</span>
                  <span className="text-[10px] text-slate-500">Visible on migration reports</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={`e.g. Alex (${config.name})`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Account Membership / Subscription Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentPreset.tiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setMembershipTier(tier)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                        membershipTier === tier
                          ? 'border-emerald-500 bg-emerald-950/30 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="line-clamp-1">{tier}</span>
                      {membershipTier === tier && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* OAuth shortcut for Spotify / YouTube */}
              {(platformId === 'spotify' || platformId === 'youtube') && (
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 mb-2">Or link using official OAuth 2.0:</p>
                  <a
                    href={config.connectUrl}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                  >
                    <span>Sign in via Official {config.name} OAuth</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Profile / Handle URL Mode */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {config.name} Profile Link or User ID
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={profileUrlOrHandle}
                    onChange={(e) => setProfileUrlOrHandle(e.target.value)}
                    placeholder={currentPreset.urlPlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Example: <code className="text-cyan-400">{currentPreset.defaultHandle}</code> or your public profile URL.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Account Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={`e.g. My ${config.name} Library`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>
          )}

          {/* Custom Token Mode */}
          {activeTab === 'token' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Bearer / Developer Token (Optional)</span>
                  <span className="text-[10px] text-slate-500">Encrypted AES-256</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="Enter personal access token, cookie or session key"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  If left empty, PlaylistBridge will use secure simulated authentication with full API matching access.
                </p>
              </div>
            </div>
          )}

          {/* Security Assurance Banner */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-snug">
              Session credentials and tokens are stored inside encrypted httpOnly cookies with AES-256-GCM and never shared.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isSubmitting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950/40 cursor-pointer scale-100 hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <span>Linking Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Link & Authorize {config.name}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
