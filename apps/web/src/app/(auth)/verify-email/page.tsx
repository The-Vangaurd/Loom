"use client";

import { useState, useEffect } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { PinInput } from "@/components/auth/pin-input";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated verification success -> proceed to MFA setup
    router.push("/mfa/setup");
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(60);
      alert("A new 6-digit verification code has been dispatched to your email.");
    }
  };

  return (
    <AuthCard
      title="Verify Your Work Email"
      description="We sent a 6-digit confirmation code to your inbox. Enter the code below to verify your corporate domain."
    >
      <div className="flex flex-col items-center justify-center space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 border border-accent/40 text-on-accent">
          <Mail size={22} />
        </div>

        <form onSubmit={handleVerify} className="w-full space-y-4">
          <PinInput
            length={6}
            value={code}
            onChange={(val) => {
              setCode(val);
              if (error) setError(null);
            }}
            error={!!error}
          />

          {error && <p className="text-center text-xs text-danger">{error}</p>}

          <Button
            type="submit"
            variant="accent"
            className="w-full mt-2"
            disabled={code.length !== 6}
            isLoading={loading}
          >
            Confirm & Secure Account
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className="inline-flex items-center text-xs text-text-tertiary hover:text-text-primary disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={12} className="mr-1.5" />
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend 6-digit code"}
            </button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}
