import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

/**
 * POST /api/auth/verifyotp
 * Verifies the OTP entered by the user
 * Receives: { email, otp }
 * Returns: { success: true, message: "Email verified" }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be a 6-digit number' },
        { status: 400 }
      );
    }

    // Check OTP from database
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // No expiry check — OTPs do not expire per configuration

    // Verify OTP matches
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mark user as verified
    await db
      .update(users)
      .set({
        verified: true,
        otp: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Create JWT and set as an HttpOnly cookie so user is automatically signed in after verification
    const token = signToken({ userId: user.id, email });
    const res = NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully!',
        email,
      },
      { status: 200 }
    );

    // Set cookie for 7 days. Omit Secure flag in development (localhost) so cookie can be set without HTTPS.
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    res.headers.set(
      'Set-Cookie',
      `token=${encodeURIComponent(token)}; Path=/; HttpOnly; ${secureFlag}SameSite=Lax; Max-Age=${maxAge}`
    );
    return res;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
