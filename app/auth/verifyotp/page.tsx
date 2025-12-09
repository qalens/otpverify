import React, { Suspense } from "react";
import VerifyOTPClient from "./VerifyOTPClient";

export const metadata = {
  title: "Verify OTP",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      {/* Client component uses `useSearchParams` and must be mounted inside a Suspense boundary */}
      <VerifyOTPClient />
    </Suspense>
  );
}
