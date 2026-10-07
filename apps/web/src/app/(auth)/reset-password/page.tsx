"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@loom/shared";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "mock-token-xyz",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordVal = watch("newPassword");

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <AuthCard
      title="Create New Password"
      description="Choose a strong, unique password to secure your workspace account."
    >
      {success ? (
        <div className="text-center space-y-3 py-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">Password Reset Complete</h4>
          <p className="text-xs text-text-secondary">
            Your password was successfully updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                error={!!errors.newPassword}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-text-tertiary hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword ? (
              <p className="text-[11px] text-danger">{errors.newPassword.message}</p>
            ) : (
              <PasswordStrength password={newPasswordVal} />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="••••••••••••"
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="accent" className="w-full mt-2" isLoading={isSubmitting}>
            Update Password & Sign In
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
