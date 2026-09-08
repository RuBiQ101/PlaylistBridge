'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  User,
  AtSign,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { PlatformAuthStatus, PlatformId } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

interface ConnectServiceDialogProps {
  platformId: PlatformId | null;
  authStatus: PlatformAuthStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export const ConnectServiceDialog: React.FC<ConnectServiceDialogProps> = ({
  platformId,
  authStatus,
  isOpen,
  onClose,
  onConnected,
}) => {
  if (!isOpen || !platformId) return null;

  const config = PLATFORMS_CONFIG[platformId] || PLATFORMS_CONFIG.amazon;

  // Derive known user identity from already connected accounts (e.g. YouTube profile name & avatar)
  const existingName =
    authStatus?.youtube?.displayName ||
    authStatus?.youtube?.channelTitle ||
    authStatus?.spotify?.displayName ||
    '';

  const existingAvatar =
    authStatus?.youtube?.avatarUrl ||
    authStatus?.spotify?.avatarUrl ||
    '';

  const [displayName, setDisplayName] = useState<string>('');
  const [userHandle, setUserHandle] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (existingName) {
      setDisplayName(existingName);
      const sanitized = existingName.toLowerCase().replace(/\s+/g, '_');
      setUserHandle(`${sanitized}@${platformId}.com`);
    } else {
      setDisplayName(`${config.name} User`);
      setUserHandle(`user_${Date.now().toString(36)}`);
    }
    if (existingAvatar) {
      setAvatarUrl(existingAvatar);
    }
  }, [platformId, existingName, existingAvatar, config.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/connect-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformId,
          displayName: displayName.trim() || `${config.name} User`,
          userId: userHandle.trim() || `${platformId}_user`,
          avatarUrl: avatarUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to connect account');
      }

      onConnected();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-md rounded-3xl bg-slate-900 border ${config.borderColor} shadow-2xl overflow-hidden`}>
        {/* Header with platform identity */}
        <div className={`p-6 bg-gradient-to-r ${config.bgColor} to-slate-900 border-b border-slate-800 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-slate-950 border ${config.borderColor} flex items-center justify-center shadow-lg font-bold text-white overflow-hidden`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className={`w-6 h-6 ${config.color}`} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Connect {config.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 ${config.color} border border-slate-700`}>
                  Account Login
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Link your user profile and playlist library
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

        {/* Connect Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Account Display Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Your Account / User Name</span>
              <span className="text-[10px] text-slate-500">Shown on connected card</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Abhishek Nautiyal"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* User Handle / Account Email / ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Account ID / Username / Email</span>
              <span className="text-[10px] text-slate-500">Unique identifier</span>
            </label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={userHandle}
                onChange={(e) => setUserHandle(e.target.value)}
                placeholder="e.g. abhishek@amazon.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Profile Photo Preview */}
          {avatarUrl && (
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
              <div className="text-[11px] text-slate-400">
                <span>Profile photo linked from your active session</span>
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorized read & write access for playlist transfer</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
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
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connect {config.name}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
