import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(fakeOTP: boolean): string {
  if (fakeOTP) return "123456";
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/signup
 * Receives: { email, firstName, lastName }
 * Generates a 6-digit OTP and sends it via email
 */
export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, password } = await request.json();

    // Validate input
    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, firstName, lastName, password",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    const fakeOTP = process.env.DONT_SEND_EMAIL == "true";
    // Generate OTP
    const otp = generateOTP(fakeOTP);

    // Validate password length
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user with new OTP and password
      await db
        .update(users)
        .set({
          firstName,
          lastName,
          otp,
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.email, email));
    } else {
      // Create new user with OTP and hashed password
      await db.insert(users).values({
        email,
        firstName,
        lastName,
        otp,
        password: hashedPassword,
        verified: false,
      });
    }

    // Send OTP via email
    await sendOTPEmail(email, otp, firstName, fakeOTP);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email. Please verify.",
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to create signup request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
