import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
  // Keep this as runtime check — don't crash at import time in tests.
  console.warn('JWT_SECRET is not set. Auth will not be secure.');
}

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
