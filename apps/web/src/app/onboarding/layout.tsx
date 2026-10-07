"use client";

import * as React from "react";
import { StepProgress, Step } from "@/components/erp/step-progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const wizardSteps: Step[] = [
  { id: "industry", title: "Industry" },
  { id: "company", title: "Company" },
  { id: "modules", title: "Modules" },
  { id: "teams", title: "Teams" },
  { id: "roles", title: "Roles" },
  { id: "invite", title: "Invite" },
  { id: "import", title: "Import" },
  { id: "done", title: "Complete" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine current active step index from current route
  const currentStepId = pathname?.split("/").pop() || "industry";
  const currentStepIndex = Math.max(
    0,
    wizardSteps.findIndex((s) => s.id === currentStepId)
  );

  const handleStepClick = (index: number) => {
    const targetStep = wizardSteps[index];
    if (targetStep) {
      router.push(`/onboarding/${targetStep.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-surface-1 px-6 md:px-12">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-border-strong text-text-primary font-mono font-bold text-base">
            L
          </div>
          <div>
            <span className="font-bold tracking-tight text-text-primary text-sm">Loom ERP</span>
            <span className="text-xs text-text-tertiary ml-2 hidden sm:inline">Workspace Setup Wizard</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Save &amp; finish later
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress Track */}
      <div className="bg-surface-1/50 border-b border-border-subtle py-3 px-6 md:px-16 overflow-x-auto">
        <div className="max-w-4xl mx-auto min-w-[500px]">
          <StepProgress
            steps={wizardSteps}
            currentStepIndex={currentStepIndex}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Step Content Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
