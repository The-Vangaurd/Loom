import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
  className?: string;
}

export function PasswordStrength({ password = "", className }: PasswordStrengthProps) {
  const criteria = [
    { label: "12+ characters", met: password.length >= 12 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  const scoreMap = [
    { label: "Too Weak", color: "bg-surface-3 text-text-tertiary", width: "w-1/4" },
    { label: "Weak", color: "bg-danger text-danger", width: "w-2/4" },
    { label: "Good", color: "bg-amber-500 text-amber-500", width: "w-3/4" },
    { label: "Strong", color: "bg-emerald-500 text-emerald-500", width: "w-full" },
  ];

  const currentScore = password ? scoreMap[Math.min(metCount - 1, 3)] || scoreMap[0] : null;

  return (
    <div className={cn("space-y-2 pt-1 text-xs", className)}>
      {password && currentScore && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-tertiary">Strength:</span>
            <span className={cn("font-semibold", currentScore.color.split(" ")[1])}>
              {currentScore.label}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
            <div
              className={cn("h-full transition-all duration-300", currentScore.color.split(" ")[0], currentScore.width)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-text-tertiary pt-1">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center space-x-1.5">
            {c.met ? (
              <Check size={12} className="text-emerald-500 shrink-0" />
            ) : (
              <X size={12} className="text-text-tertiary/60 shrink-0" />
            )}
            <span className={c.met ? "text-text-secondary" : ""}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
