"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptInviteSchema, AcceptInviteInput } from "@loom/shared";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Building2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      inviteToken: "token-9988-invitation",
      fullName: "Marcus Aurelius",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordVal = watch("password");

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/dashboard");
  };

  return (
    <AuthCard
      title="Join Acme Industrial Corp"
      description="You have been invited by Sarah Chen to join the Logistics & Supply Chain team."
    >
      <div className="mb-4 rounded-lg bg-surface-2 p-3 border border-border-subtle flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/20 text-on-accent font-bold text-xs">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">Acme Industrial Corp</p>
            <p className="text-[10px] text-text-tertiary">Role: Operations Specialist</p>
          </div>
        </div>
        <Badge variant="accent">Invited</Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Your Full Name
          </label>
          <Input
            placeholder="Marcus Aurelius"
            error={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-[11px] text-danger">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Set Your Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              error={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-text-tertiary hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-[11px] text-danger">{errors.password.message}</p>
          ) : (
            <PasswordStrength password={passwordVal} />
          )}
        </div>

        <div className="space-y-1">
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
          <UserPlus size={15} className="mr-2" />
          Accept Invitation & Join
        </Button>
      </form>
    </AuthCard>
  );
}
