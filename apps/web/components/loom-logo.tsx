import React from "react";

interface LoomLogoProps {
  className?: string;
  size?: "xs" | "sm" | "icon" | "minimal";
}

export function LoomLogo({ className = "", size = "sm" }: LoomLogoProps) {
  // Simple and clean wordmark: no border, no dot, no background container
  const sizeClasses = {
    icon: "text-[11px] font-semibold tracking-wider",
    xs: "text-[11px] font-medium tracking-tight",
    minimal: "text-[11px] font-medium tracking-tight",
    sm: "text-xs font-semibold tracking-tight",
  }[size];

  return (
    <span
      className={`font-mono lowercase select-none text-black dark:text-[#FFEFD4] transition-colors ${sizeClasses} ${className}`}
      title="loom"
    >
      loom
    </span>
  );
}
