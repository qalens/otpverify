import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const usersResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (usersResult.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 404 });
    }

    const user = usersResult[0] as any;

    if (!user.verified) {
      return NextResponse.json({ error: 'Email not verified' }, { status: 403 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'User has no password set' }, { status: 400 });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email });
    const res = NextResponse.json({ success: true }, { status: 200 });

    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    res.headers.set(
      'Set-Cookie',
      `token=${encodeURIComponent(token)}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=${maxAge}`
    );

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
