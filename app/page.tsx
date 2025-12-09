"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-3xl rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to OTPVerify</h1>
            <p className="text-muted-foreground mt-2">
              A small demo for email/OTP verification. Create an account to get
              started or go to your dashboard after verification.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/auth/signup" className="inline-block">
                <Button>Sign Up</Button>
              </Link>

              <Link href="/auth/login" className="inline-block">
                <Button variant="outline">Login</Button>
              </Link>

              <Link href="/dashboard" className="inline-block">
                <Button variant="ghost">Go To Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-md border bg-muted p-4 text-sm">
              <strong>Note:</strong> This demo does not yet wire an auth
              backend. The dashboard page is a placeholder representing the
              screen a user would see after OTP verification.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
