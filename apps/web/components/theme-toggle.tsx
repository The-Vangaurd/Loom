"use client";

import React from "react";
import { useTheme } from "@/context/theme-context";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-[12px] bg-surface-1 border border-border-strong text-text-primary hover:bg-surface-hover hover:scale-105 active:scale-95 transition-all shadow-sm ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#D4DDFF] animate-in fade-in zoom-in duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-[#000000] animate-in fade-in zoom-in duration-200" />
      )}
    </button>
  );
}
