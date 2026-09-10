'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Loader2,
  Smartphone,
  Music2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { PlatformAuthStatus } from '@/lib/types';
import { PLATFORMS_CONFIG } from '@/lib/platforms';

interface JioSaavnLoginDialogProps {
  isOpen: boolean;
  authStatus: PlatformAuthStatus | null;
  onClose: () => void;
  onLoggedIn: () => void;
}

type LoginStep = 'phone' | 'otp' | 'success';

export const JioSaavnLoginDialog: React.FC<JioSaavnLoginDialogProps> = ({
  isOpen,
  authStatus,
  onClose,
  onLoggedIn,
}) => {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [otpRequestId, setOtpRequestId] = useState<string>('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const config = PLATFORMS_CONFIG.jiosaavn;

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setOtpDigits(['', '', '', '', '', '']);
      setIsSubmitting(false);
      setErrorMsg(null);
      setAccountName('');
      setResendTimer(0);
      setOtpRequestId('');
    }
  }, [isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Auto-focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }
  }, [step]);

  if (!isOpen) return null;

  // Format phone number for display
  const formatPhone = (num: string): string => {
    const clean = num.replace(/\D/g, '');
    if (clean.length >= 10) {
      const last10 = clean.slice(-10);
      return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }
    return num;
  };

  // ========== STEP 1: Send OTP ==========
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/jiosaavn/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone.slice(-10), // last 10 digits
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP. Please try again.');
      }

      setOtpRequestId(data.requestId || '');
      setResendTimer(30); // 30 second cooldown
      setStep('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== STEP 2: Verify OTP ==========
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const otp = otpDigits.join('');
    if (otp.length < 4) {
      setErrorMsg('Please enter the complete OTP.');
      setIsSubmitting(false);
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

    try {
      const res = await fetch('/api/auth/jiosaavn/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          otp: otp,
          requestId: otpRequestId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid OTP. Please try again.');
      }

      // Success!
      setAccountName(data.account?.displayName || `+91 ${cleanPhone}`);
      setStep('success');

      setTimeout(() => {
        onLoggedIn();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-move to next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === 5) {
      const fullOtp = newDigits.join('');
      if (fullOtp.length === 6) {
        setTimeout(() => handleVerifyOTP(), 300);
      }
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pasted.length, 5);
      otpRefs.current[focusIndex]?.focus();

      if (pasted.length === 6) {
        setTimeout(() => handleVerifyOTP(), 300);
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setErrorMsg(null);
    setOtpDigits(['', '', '', '', '', '']);
    
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    try {
      const res = await fetch('/api/auth/jiosaavn/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpRequestId(data.requestId || '');
        setResendTimer(30);
        setErrorMsg(null);
      } else {
        setErrorMsg(data.error || 'Failed to resend OTP.');
      }
    } catch {
      setErrorMsg('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl overflow-hidden">

        {/* ========== SUCCESS STATE ========== */}
        {step === 'success' ? (
          <div className="p-10 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome, {accountName}!</h3>
            <p className="text-sm text-slate-400">
              Your JioSaavn account is now connected. Loading your playlists...
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Syncing library...</span>
            </div>
          </div>
        ) : (
          <>
            {/* ========== HEADER ========== */}
            <div className="p-6 bg-gradient-to-r from-teal-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 border border-teal-500/40 flex items-center justify-center shadow-lg">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white">
                      {step === 'phone' ? 'Login to JioSaavn' : 'Verify OTP'}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-950 text-teal-400 border border-teal-700">
                      {step === 'phone' ? 'Step 1/2' : 'Step 2/2'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {step === 'phone'
                      ? 'Enter your registered phone number'
                      : `OTP sent to ${formatPhone(phoneNumber)}`}
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

            {/* ========== STEP 1: PHONE NUMBER ========== */}
            {step === 'phone' && (
              <form onSubmit={handleSendOTP} className="p-6 space-y-4">
                {/* Error Message */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Info Banner */}
                <div className="p-3 rounded-2xl bg-teal-950/30 border border-teal-500/20 flex items-start gap-2.5 text-[11px] text-slate-300">
                  <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-teal-400 mb-0.5">OTP-Based Authentication</p>
                    <p className="text-slate-400">
                      JioSaavn will send a one-time password to your registered mobile number.
                      No password needed.
                    </p>
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Registered Phone Number</span>
                    <span className="text-[10px] text-slate-500">Linked to JioSaavn</span>
                  </label>
                  <div className="relative flex items-stretch">
                    {/* Country Code */}
                    <div className="flex items-center gap-1.5 px-3 bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl text-sm text-slate-300 font-semibold">
                      <span className="text-base">🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <div className="relative flex-1">
                      <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
                        placeholder="98765 43210"
                        required
                        maxLength={14}
                        autoComplete="tel"
                        autoFocus
                        className="w-full bg-slate-950 border border-slate-800 rounded-r-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your number is only used to receive the OTP. It is not stored by PlaylistBridge.</span>
                </div>

                {/* Action Buttons */}
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
                    disabled={isSubmitting || phoneNumber.replace(/\D/g, '').length < 10}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                      isSubmitting || phoneNumber.replace(/\D/g, '').length < 10
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/40 cursor-pointer scale-100 hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ========== STEP 2: OTP VERIFICATION ========== */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="p-6 space-y-5">
                {/* Error Message */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* OTP Sent Confirmation */}
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-400 mb-0.5">OTP Sent Successfully!</p>
                    <p className="text-slate-400">
                      Enter the 6-digit code sent to <span className="text-white font-semibold">{formatPhone(phoneNumber)}</span>
                    </p>
                  </div>
                </div>

                {/* OTP Input Boxes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 text-center block">
                    Enter OTP Code
                  </label>
                  <div className="flex items-center justify-center gap-2.5">
                    {otpDigits.map((digit, i) => (
                      <React.Fragment key={i}>
                        <input
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className={`w-11 h-13 text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                            digit
                              ? 'bg-teal-950/40 border-teal-500/60 text-teal-300 shadow-md shadow-teal-950/30'
                              : 'bg-slate-950 border-slate-700 text-white focus:border-teal-500'
                          }`}
                        />
                        {i === 2 && (
                          <span className="text-slate-600 text-lg font-bold mx-0.5">–</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <span className="text-[11px] text-slate-500">
                      Resend OTP in <span className="text-teal-400 font-bold">{resendTimer}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold transition cursor-pointer"
                    >
                      Didn't receive the code? Resend OTP →
                    </button>
                  )}
                </div>

                {/* Security Note */}
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
                  <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>OTP expires in 5 minutes. Only a session token is stored after verification.</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setErrorMsg(null);
                      setOtpDigits(['', '', '', '', '', '']);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Number</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || otpDigits.join('').length < 4}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                      isSubmitting || otpDigits.join('').length < 4
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/40 cursor-pointer scale-100 hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Login</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
