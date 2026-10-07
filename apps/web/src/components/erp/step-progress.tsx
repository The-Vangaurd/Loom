import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function StepProgress({
  steps,
  currentStepIndex,
  onStepClick,
  className,
}: StepProgressProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-surface-3 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-accent transition-all duration-300 z-0"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center cursor-pointer group"
              onClick={() => onStepClick && onStepClick(idx)}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border-2 transition-all",
                  isCompleted
                    ? "bg-accent border-accent text-on-accent"
                    : isCurrent
                    ? "bg-surface-1 border-accent text-text-primary ring-4 ring-accent/20"
                    : "bg-surface-2 border-border-strong text-text-tertiary"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 text-[11px] font-medium whitespace-nowrap transition-colors",
                  isCurrent
                    ? "text-text-primary font-semibold"
                    : "text-text-tertiary group-hover:text-text-secondary"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
