"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";

type ToastState = {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
};

export default function VerifyOTPClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const validateForm = (): boolean => {
    if (!otp.trim()) {
      showToast("OTP is required", "error");
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      showToast("OTP must be a 6-digit number", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || "Invalid OTP", "error");
        setLoading(false);
        return;
      }

      showToast("Email verified successfully!", "success");

      // Navigate to dashboard or next page after a brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Verification error:", error);
      showToast("An unexpected error occurred", "error");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card id="verify-otp-form">
          <CardTitle className="px-6">Verify OTP</CardTitle>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mt-1">
                Enter the 6-digit OTP sent to {email}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  disabled={loading}
                  required
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              Didn't receive the OTP?{" "}
              <button
                onClick={() => router.push("/auth/signup")}
                className="text-sky-600 hover:underline"
              >
                Sign up again
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </>
  );
}
