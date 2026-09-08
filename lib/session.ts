import { cookies } from 'next/headers';
import crypto from 'crypto';
import { PlatformId } from './types';

const SESSION_COOKIE_NAME = 'playlistbridge_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'playlistbridge-default-super-secret-key-32-chars';

export interface AccountSessionInfo {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
  displayName?: string;
  channelTitle?: string;
  avatarUrl?: string;
}

export interface SessionData {
  spotify?: AccountSessionInfo;
  youtube?: AccountSessionInfo;
  apple?: AccountSessionInfo;
  amazon?: AccountSessionInfo;
  jiosaavn?: AccountSessionInfo;
  soundcloud?: AccountSessionInfo;
  tidal?: AccountSessionInfo;
  isDemoMode?: boolean;
}

// Lightweight AES-256-GCM session encryption
function getKey(): Buffer {
  return crypto.createHash('sha256').update(SESSION_SECRET).digest();
}

export function encryptSession(data: SessionData): string {
  const iv = crypto.randomBytes(12);
  const key = getKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  const jsonStr = JSON.stringify(data);
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptSession(sessionStr: string): SessionData | null {
  try {
    const parts = sessionStr.split(':');
    if (parts.length !== 3) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const key = getKey();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted) as SessionData;
  } catch (error) {
    return null;
  }
}

// Global in-memory session bridge across localhost and 127.0.0.1
declare global {
  var __playlistBridgeSession: SessionData | undefined;
}

export async function getSession(): Promise<SessionData> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  let cookieSession: SessionData | null = null;
  if (sessionCookie && sessionCookie.value) {
    cookieSession = decryptSession(sessionCookie.value);
  }

  const globalSession = global.__playlistBridgeSession || {};

  // Resilient merge across all platforms
  const mergedSession: SessionData = {
    spotify: globalSession.spotify || cookieSession?.spotify,
    youtube: globalSession.youtube || cookieSession?.youtube,
    apple: globalSession.apple || cookieSession?.apple,
    amazon: globalSession.amazon || cookieSession?.amazon,
    jiosaavn: globalSession.jiosaavn || cookieSession?.jiosaavn,
    soundcloud: globalSession.soundcloud || cookieSession?.soundcloud,
    tidal: globalSession.tidal || cookieSession?.tidal,
    isDemoMode: globalSession.isDemoMode || cookieSession?.isDemoMode || false,
  };

  global.__playlistBridgeSession = mergedSession;
  return mergedSession;
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Allow both http://localhost and http://127.0.0.1 in development
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function saveSession(session: SessionData): Promise<void> {
  global.__playlistBridgeSession = session;
  const cookieStore = cookies();
  const encrypted = encryptSession(session);
  cookieStore.set(SESSION_COOKIE_NAME, encrypted, SESSION_COOKIE_OPTIONS);
}

export function setSessionCookie(response: any, session: SessionData): void {
  global.__playlistBridgeSession = session;
  const encrypted = encryptSession(session);
  response.cookies.set(SESSION_COOKIE_NAME, encrypted, SESSION_COOKIE_OPTIONS);
}

export async function clearSession(): Promise<void> {
  global.__playlistBridgeSession = undefined;
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function clearSessionCookie(response: any): void {
  global.__playlistBridgeSession = undefined;
  response.cookies.delete(SESSION_COOKIE_NAME);
}
