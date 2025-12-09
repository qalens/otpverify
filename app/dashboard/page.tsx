"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-4xl rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Dashboard</h1>
            <Link href="/" className="inline-block">
              <Button variant="ghost">Sign Out</Button>
            </Link>
          </div>

          <div className="rounded-md border p-4 bg-muted">
            <p className="text-sm text-muted-foreground">
              This dashboard represents the area a user sees after successful
              OTP verification. Integrate your verification flow to redirect
              users here after they confirm their code.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <h2 className="font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground mt-2">
                User profile and settings would appear here.
              </p>
            </div>

            <div className="rounded-md border p-4">
              <h2 className="font-semibold">Activity</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Recent events, verification status and logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
