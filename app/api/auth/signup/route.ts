import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/email';

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/signup
 * Receives: { email, firstName, lastName }
 * Generates a 6-digit OTP and sends it via email
 */
export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user with new OTP
      await db
        .update(users)
        .set({
          firstName,
          lastName,
          otp,
          updatedAt: new Date(),
        })
        .where(eq(users.email, email));
    } else {
      // Create new user with OTP
      await db.insert(users).values({
        email,
        firstName,
        lastName,
        otp,
        verified: false,
      });
    }

    // Send OTP via email
    await sendOTPEmail(email, otp, firstName);

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to your email. Please verify.',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create signup request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
