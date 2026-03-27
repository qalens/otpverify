import nodemailer from "nodemailer";

/**
 * Initialize SMTP transporter with environment variables
 */
const createSmtpTransporter = () => {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const secureRaw = process.env.SMTP_SECURE;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) {
    throw new Error("SMTP_HOST environment variable is not set");
  }
  if (!portRaw) {
    throw new Error("SMTP_PORT environment variable is not set");
  }

  const port = Number.parseInt(portRaw, 10);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  const secure = secureRaw
    ? secureRaw.toLowerCase() === "true"
    : port === 465;

  if (user && !pass) {
    throw new Error("SMTP_PASS environment variable is not set");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass: pass ?? "" } : undefined,
  });
};

/**
 * Send OTP via email using SMTP relay
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @param firstName - User's first name (for personalization)
 * @returns Promise that resolves when email is sent
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  firstName: string,
  dontSendEmail?:boolean,
): Promise<void> {
  try {
    
    if (dontSendEmail) {
      console.log(
        `DONT_SEND_EMAIL is set. Skipping sending email to ${email} with OTP: ${otp}`
      );
      return;
    } else {
      const transporter = createSmtpTransporter();

      const fromEmail = process.env.SMTP_FROM_EMAIL;
      if (!fromEmail) {
        throw new Error("SMTP_FROM_EMAIL environment variable is not set");
      }

      const message = {
        to: email,
        from: fromEmail,
        subject: "Your OTP Code for Registration",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Hi ${firstName},
            </p>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Your one-time password (OTP) for email verification is:
            </p>
            
            <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              This code will expire in 30 minutes. Do not share this code with anyone.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
              If you did not request this verification code, please ignore this email or contact support.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 OTP Verify. All rights reserved.
            </p>
          </div>
        </div>
      `,
        text: `Your OTP code is: ${otp}. This code will expire in 30 minutes. Do not share this code with anyone.`,
      };

      await transporter.sendMail(message);
      console.log(`OTP email sent successfully to ${email}`);
    }
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email. Please try again later.");
  }
}
