"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export function PinInput({
  length = 6,
  value,
  onChange,
  error = false,
  disabled = false,
}: PinInputProps) {
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const arr = value.split("");
    arr[idx] = char;
    const newVal = arr.join("").slice(0, length);
    onChange(newVal);

    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(paste);
    const focusIndex = Math.min(paste.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-10 sm:w-11 text-center text-lg font-mono font-bold rounded-md border bg-surface-1 text-text-primary shadow-xs transition-all focus:outline-none focus:ring-2",
            error
              ? "border-danger focus:ring-danger text-danger"
              : "border-border-strong focus:border-accent focus:ring-accent/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}
