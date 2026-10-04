"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  ROLE_DEFINITIONS,
  IndustryRole,
  onboardingRoleSchema,
} from "@erp/schemas";
import {
  GraduationCap,
  Code2,
  Factory,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building,
  Check,
  Shield,
  Layers,
  AlertCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoomLogo } from "@/components/loom-logo";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setOrganizationRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState<IndustryRole>("software");
  const [organizationName, setOrganizationName] = useState(
    user?.name ? `${user.name}'s Workspace` : "Acme Corp"
  );
  const [teamSize, setTeamSize] = useState<"1-10" | "11-50" | "51-200" | "201-1000" | "1000+">("11-50");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rolesList: { id: IndustryRole; icon: React.ElementType }[] = [
    { id: "education", icon: GraduationCap },
    { id: "software", icon: Code2 },
    { id: "enterprise", icon: Factory },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = onboardingRoleSchema.safeParse({
      role: selectedRole,
      organizationName,
      teamSize,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Please check your inputs");
      return;
    }

    setIsSubmitting(true);
    await setOrganizationRole(selectedRole, organizationName);
    setIsSubmitting(false);

    router.push(`/dashboard?role=${selectedRole}`);
  };

  const activeMetadata = ROLE_DEFINITIONS[selectedRole];

  return (
    <div className="min-h-screen w-full bg-bg text-text-primary flex flex-col items-center justify-between p-6 md:p-12 relative overflow-x-hidden transition-colors duration-300">
      {/* Background Calm Radial Glows */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-accent/[0.04] blur-[150px] pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      {/* ── Top Header ── */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 border-b border-border-subtle z-10">
        <div className="flex items-center gap-3">
          <LoomLogo size="sm" />
          <span className="text-text-tertiary text-xs font-mono">/</span>
          <span className="font-mono text-xs text-text-secondary tracking-tight">
            AI-Native ERP
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-surface-1 px-3 py-1.5 rounded-[10px] border border-border-subtle shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Workspace Setup</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl my-10 z-10 flex flex-col items-center">
        {/* Title Header */}
        <div className="text-center max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[10px] bg-surface-1 border border-border-strong text-text-primary text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#D4DDFF]" />
            <span>Select Your Industry Archetype</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
            Choose your organization&apos;s vertical
          </h1>
          <p className="text-sm text-text-secondary font-medium leading-relaxed">
            Your choice initializes tailored AI agents, operational workflows, and domain-specific schemas. You can adjust modules anytime.
          </p>
        </div>

        {/* ── 3 Role Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-10">
          {rolesList.map(({ id, icon: Icon }) => {
            const role = ROLE_DEFINITIONS[id];
            const isSelected = selectedRole === id;

            return (
              <div
                key={id}
                onClick={() => setSelectedRole(id)}
                className={[
                  "relative rounded-2xl p-6 cursor-pointer select-none",
                  "flex flex-col transition-all duration-200",
                  "bg-surface-1",
                  isSelected
                    ? "border-2 border-black dark:border-accent -translate-y-0.5 shadow-[0_12px_40px_rgba(0,0,0,0.13)] dark:shadow-[0_0_0_1px_rgba(212,221,255,0.25),0_8px_30px_rgba(212,221,255,0.10)]"
                    : "border border-border-subtle hover:border-border-strong hover:shadow-sm",
                ].join(" ")}
              >
                {/* Selected indicator — top right corner */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    {/* Light: filled blue circle check */}
                    <CheckCircle2 className="w-5 h-5 text-[#3B82F6] dark:hidden" />
                    {/* Dark: small white filled dot */}
                    <div className="hidden dark:flex w-4 h-4 rounded-full bg-white/90 items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0D0D0E]" />
                    </div>
                  </div>
                )}

                {/* Icon square — neutral, doesn't invert on selection */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-surface-2 border border-border-subtle text-text-secondary">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge chip */}
                <div className="self-start text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-[5px] mb-3
                  bg-[#D4DDFF]/25 dark:bg-[#D4DDFF]/10
                  text-[#4050A0] dark:text-[#D4DDFF]
                  border border-[#D4DDFF]/60 dark:border-[#D4DDFF]/20">
                  {role.badge}
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold leading-snug text-text-primary mb-1">
                  {role.title}
                </h3>

                {/* Tagline */}
                <p className="text-xs font-semibold text-text-secondary mb-2 leading-snug">
                  {role.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-text-tertiary leading-relaxed mb-5">
                  {role.description}
                </p>

                {/* Key Modules */}
                <div className="pt-4 border-t border-border-subtle mt-auto">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.13em] text-text-primary mb-2.5">
                    Key Modules Included
                  </p>
                  <ul className="space-y-1.5">
                    {role.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-primary font-normal">
                        {/* Light: blue checkmark / Dark: white checkmark */}
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#3B82F6] dark:text-white" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Organization Config Form */}
        <form
          noValidate
          onSubmit={handleSubmit}
          className="w-full bg-surface-1 border border-border-strong rounded-container p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm font-heading font-bold text-text-primary mb-6">
            <Building className="w-4 h-4 text-[#3B82F6] dark:text-[#D4DDFF]" />
            <span>Workspace Details for {activeMetadata.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Organization / Company Name
              </label>
              <div className={`relative flex items-center w-full ${error && !organizationName.trim() ? "z-30" : ""}`}>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => {
                    setOrganizationName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Acme Technologies Ltd"
                  className={`w-full h-11 px-4 rounded-[12px] text-sm focus:outline-none transition-all placeholder:text-text-tertiary ${
                    error && !organizationName.trim()
                      ? "!bg-red-50 dark:!bg-red-950/30 !border-red-500 !text-red-950 dark:!text-red-200 focus:ring-2 focus:ring-red-400/40"
                      : organizationName.trim().length > 0
                      ? "bg-[#E8F0FE] dark:bg-[#D4DDFF]/15 border-[#BFDBFE] dark:border-[#D4DDFF]/40 text-text-primary focus:border-[#3B82F6] focus:ring-2 focus:ring-[#D4DDFF]/50"
                      : "bg-surface-2 border border-border-strong text-text-primary focus:border-black dark:focus:border-[#D4DDFF] focus:ring-2 focus:ring-[#D4DDFF]/50"
                  }`}
                />
                {error && !organizationName.trim() && (
                  <div className="auth-overlapping-pop" role="alert">
                    <span className="auth-overlapping-pop-arrow" />
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Please fill out this field.</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Team Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(["1-10", "11-50", "51-200", "201-1000", "1000+"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`h-11 rounded-xl text-xs font-mono font-bold border transition-all ${
                      teamSize === size
                        ? "bg-text-primary text-bg border-text-primary shadow-sm"
                        : "bg-surface-2 text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary">
              <Shield className="w-3.5 h-3.5" />
              <span>Multi-tenant Row-Level Security (RLS) enabled</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-7 rounded-xl bg-text-primary text-bg font-heading font-bold text-sm
                hover:opacity-90 active:scale-[0.98] transition-all
                flex items-center gap-2 shadow-[0_6px_18px_rgba(0,0,0,0.18)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Initializing..." : "Launch ERP Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-4 flex items-center justify-between text-xs text-text-tertiary border-t border-border-subtle z-10">
        <div className="flex items-center gap-2">
          <LoomLogo size="xs" />
          <span>AI-Native ERP • Calm, Trustworthy</span>
        </div>
        <span>Keyboard Shortcut: <kbd className="font-mono text-text-secondary">Cmd+K</kbd></span>
      </footer>
    </div>
  );
}
