import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const SESSION_COOKIE_NAME = 'fw_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production');
    }
    // Dev-only fallback
    return process.env.MONGODB_URI || 'dev-insecure-secret-change-me';
  }
  return secret;
}

function sign(value: string): string {
  const hmac = crypto.createHmac('sha256', getSecret());
  hmac.update(value);
  return `${value}.${hmac.digest('base64url')}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signed.slice(0, lastDot);
  const expected = sign(value);
  if (signed.length !== expected.length) return null;
  // Timing-safe comparison
  const a = Buffer.from(signed);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  return value;
}

export async function createSession(email: string): Promise<void> {
  const payload = JSON.stringify({ email, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const token = sign(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie) return null;

  const payload = verify(cookie.value);
  if (!payload) return null;

  try {
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
