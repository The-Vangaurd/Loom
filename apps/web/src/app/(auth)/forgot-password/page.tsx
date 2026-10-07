"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@loom/shared";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const emailVal = watch("email");

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <AuthCard
      title="Reset Your Password"
      description="Enter your corporate email address to receive password recovery instructions."
      footer={
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={13} className="mr-1.5" />
            Return to sign in
          </Link>
        </div>
      }
    >
      {submitted ? (
        <div className="text-center space-y-4 py-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-text-primary">Check your inbox</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              We dispatched a secure password reset link to <span className="font-semibold text-text-primary">{emailVal}</span>.
            </p>
          </div>
          <Link href="/reset-password?token=mock-token-xyz">
            <Button variant="outline" size="sm" className="w-full mt-2 font-mono text-xs">
              Simulate Opening Email Link &rarr;
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Corporate Email
            </label>
            <Input
              type="email"
              placeholder="alex@company.com"
              error={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-[11px] text-danger">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" variant="accent" className="w-full" isLoading={isSubmitting}>
            Send Recovery Link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
