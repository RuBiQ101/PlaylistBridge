'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name.trim() || email.split('@')[0] || 'Music Explorer';
    const userEmail = email.trim() || 'user@playlistbridge.io';
    onAuthSuccess({ name: displayName, email: userEmail });
    onClose();
  };

  const handleGuestContinue = () => {
    onAuthSuccess({ name: 'Guest User', email: 'guest@playlistbridge.io' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-emerald-950/40 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-spotify/20 border border-emerald-500/30 flex items-center justify-center text-spotify shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {isSignUp ? 'Create your Account' : 'Welcome to PlaylistBridge'}
          </h3>
          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Sign up to save migration history and sync across devices.'
              : 'Sign in to access universal playlist transfer.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivers"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-spotify hover:from-emerald-400 hover:to-spotify-accent text-black font-bold text-sm shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSignUp ? 'Create Free Account' : 'Sign In & Start'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-900 px-3 text-slate-500">or</span>
          </div>
        </div>

        {/* Quick Guest Continue */}
        <button
          onClick={handleGuestContinue}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/60 transition flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Continue as Guest (No Registration)</span>
        </button>

        {/* Toggle Sign Up / Login */}
        <div className="text-center mt-5 text-xs text-slate-400">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"} </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-spotify font-semibold hover:underline ml-1"
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
};
