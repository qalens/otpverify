import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ success: true }, { status: 200 });
  // Clear the token cookie. Omit Secure in development so clearing works on localhost.
  const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  res.headers.set('Set-Cookie', `token=; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=0`);
  return res;
}
