"use client";

import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { PinInput } from "@/components/auth/pin-input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MfaSetupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockSecret = "JBSWY3DPEHPK3PXP";

  const handleCopy = () => {
    navigator.clipboard.writeText(mockSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please input the 6-digit TOTP code from your authenticator app.");
      return;
    }

    setLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Successful MFA enrollment -> land on blank dashboard!
    router.push("/dashboard");
  };

  return (
    <AuthCard
      title="Setup Two-Factor Authentication"
      description="Scan the QR code with Google Authenticator, 1Password, or Authy to secure your workspace."
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Mock QR Code Graphic */}
        <div className="p-3 rounded-lg border border-border-strong bg-white shadow-xs">
          <div className="h-36 w-36 bg-slate-900 rounded flex flex-col items-center justify-center p-2 text-center text-white">
            <ShieldCheck size={40} className="text-accent mb-1" />
            <span className="font-mono text-[9px] tracking-wider text-slate-300">
              MOCK-TOTP-SECRET
            </span>
          </div>
        </div>

        {/* Manual secret code fallback */}
        <div className="w-full space-y-1 text-center">
          <span className="text-[11px] text-text-tertiary">Can&apos;t scan? Enter manually:</span>
          <div className="flex items-center justify-center space-x-2">
            <code className="rounded bg-surface-2 px-2 py-1 font-mono text-xs font-semibold text-text-primary border border-border-subtle">
              {mockSecret}
            </code>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
              title="Copy secret"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Form Verification */}
        <form onSubmit={handleVerify} className="w-full space-y-4 pt-2">
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              6-Digit Authenticator Code
            </label>
            <PinInput
              length={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                if (error) setError(null);
              }}
              error={!!error}
            />
          </div>

          {error && <p className="text-center text-xs text-danger">{error}</p>}

          <Button
            type="submit"
            variant="accent"
            className="w-full mt-2"
            disabled={code.length !== 6}
            isLoading={loading}
          >
            Verify & Finish Enrollment
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
