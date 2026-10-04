"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ROLE_DEFINITIONS, IndustryRole } from "@erp/schemas";
import {
  Layers,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  GraduationCap,
  Code2,
  Factory,
  Package,
  BookOpen,
  GitBranch,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoomLogo } from "@/components/loom-logo";

function DashboardContent() {
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get("role") as IndustryRole) || "software";
  const { user, organization } = useAuth();

  const role = organization?.industry || roleParam;
  const roleMeta = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.software;

  const [activeTab, setActiveTab] = useState("overview");

  // Role-specific metrics
  const getRoleMetrics = () => {
    switch (role) {
      case "education":
        return [
          { label: "Active Students", value: "3,842", change: "+12.4%", icon: GraduationCap },
          { label: "Course Enrollments", value: "14,920", change: "+8.1%", icon: BookOpen },
          { label: "Term Fee Collected", value: "₹4,82,50,000", change: "94.2%", icon: CreditCard },
          { label: "Faculty Utilization", value: "88.6%", change: "+2.3%", icon: Users },
        ];
      case "enterprise":
        return [
          { label: "Inventory SKU Count", value: "18,420", change: "+4.2%", icon: Package },
          { label: "Active Warehouses", value: "12 Hubs", change: "100% SLA", icon: Factory },
          { label: "Monthly Procurement", value: "₹1,24,50,000", change: "-3.1%", icon: CreditCard },
          { label: "Fulfillment Accuracy", value: "99.8%", change: "+0.4%", icon: CheckCircle2 },
        ];
      case "software":
      default:
        return [
          { label: "Active Sprints", value: "8 Active", change: "94% On-Track", icon: GitBranch },
          { label: "Monthly Cloud Spend", value: "$14,240.00", change: "-6.5%", icon: CreditCard },
          { label: "Retainer Invoiced", value: "₹84,20,000", change: "+18.2%", icon: TrendingUp },
          { label: "PR Merge Velocity", value: "4.2 hrs", change: "-32%", icon: Clock },
        ];
    }
  };

  const metrics = getRoleMetrics();

  return (
    <div className="flex h-screen w-full bg-bg text-text-primary overflow-hidden transition-colors duration-300">
      {/* 56px Icon Rail */}
      <aside className="w-14 flex-shrink-0 bg-surface-1 border-r border-border-subtle flex flex-col items-center justify-between py-3 z-30 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <LoomLogo size="icon" />

          <nav className="flex flex-col gap-2 mt-4">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Overview" },
              { id: "modules", icon: role === "education" ? GraduationCap : role === "enterprise" ? Factory : Code2, label: "Modules" },
              { id: "finance", icon: CreditCard, label: "Finance & Billing" },
              { id: "team", icon: Users, label: "Team" },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-9 h-9 rounded-control flex items-center justify-center transition-all ${
                  activeTab === id
                    ? "bg-black dark:bg-[#D4DDFF] text-[#D4DDFF] dark:text-black shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button className="w-9 h-9 rounded-control text-text-secondary hover:text-text-primary hover:bg-surface-hover flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-black dark:bg-[#D4DDFF] border border-black dark:border-[#D4DDFF] flex items-center justify-center text-xs font-bold text-[#D4DDFF] dark:text-black">
            {user?.name ? user.name.charAt(0).toUpperCase() : "E"}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 56px Top Bar */}
        <header className="h-14 bg-surface-1 border-b border-border-subtle flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs">
            <LoomLogo size="xs" />
            <span className="text-text-tertiary">/</span>
            <span className="font-bold text-text-primary">
              {organization?.name || "Enterprise Core"}
            </span>
            <span className="px-2.5 py-0.5 rounded-[6px] bg-[#D4DDFF]/70 dark:bg-[#D4DDFF]/20 border border-[#7C95EA]/40 dark:border-[#D4DDFF]/30 text-[11px] text-[#000000] dark:text-[#D4DDFF] font-bold font-mono">
              {roleMeta.badge}
            </span>
          </div>

          {/* Cmd+K Command Bar Trigger */}
          <button className="flex items-center gap-3 h-9 px-3.5 rounded-[10px] bg-surface-2 border border-border-strong text-text-secondary text-xs hover:border-black dark:hover:border-white hover:text-text-primary transition-all w-72 justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-text-tertiary" />
              <span>Ask or search...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-1 border border-border-strong text-[10px] font-mono text-text-secondary font-semibold">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-control bg-surface-2 border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary">
              <Bell className="w-3.5 h-3.5" />
            </button>
            <ThemeToggle />
            <div className="h-4 w-px bg-border-subtle" />
            <span className="text-xs text-text-secondary font-mono font-medium">
              {user?.email || "admin@enterprise.ai"}
            </span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* AI Assistant Action Bar */}
          <div className="p-4 rounded-container bg-surface-1 border border-border-strong flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-control bg-black dark:bg-[#D4DDFF] text-[#D4DDFF] dark:text-black flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-heading font-bold text-text-primary">Autonomous Agent</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[6px] bg-[#D4DDFF]/70 dark:bg-[#D4DDFF]/20 text-[#000000] dark:text-[#D4DDFF] border border-[#7C95EA]/40 dark:border-[#D4DDFF]/30">
                    Live
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">
                  Initialized 6 autonomous workflows tailored for <strong className="text-text-primary">{roleMeta.title}</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="h-8 px-3 rounded-control text-xs font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                Dismiss
              </button>
              <button className="h-8 px-4 rounded-control bg-black dark:bg-[#D4DDFF] text-[#D4DDFF] dark:text-black font-bold text-xs hover:bg-[#171717] dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm">
                Run Audit
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-container bg-surface-1 border border-border-subtle hover:border-border-strong shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between text-text-secondary mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
                    <Icon className="w-4 h-4 text-[#3B82F6] dark:text-[#D4DDFF]" />
                  </div>
                  <div className="text-2xl font-bold text-text-primary font-mono tracking-tight mb-1">
                    {m.value}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#16a34a] font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Modules Table & Operations */}
          <div className="bg-surface-1 border border-border-subtle rounded-container p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  {roleMeta.title} Modules
                </h2>
                <p className="text-xs text-text-secondary mt-0.5 font-medium">
                  Configured schemas and automated background queues
                </p>
              </div>
              <button className="h-8 px-4 rounded-control bg-black dark:bg-[#D4DDFF] text-[#D4DDFF] dark:text-black text-xs font-bold hover:bg-[#171717] dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm">
                + Add Custom Module
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-strong text-text-secondary uppercase tracking-wider font-mono font-bold">
                    <th className="py-3 px-4">Module Name</th>
                    <th className="py-3 px-4">Schema Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Agent Automation</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {roleMeta.features.map((feat, idx) => (
                    <tr key={idx} className="hover:bg-surface-hover transition-colors">
                      <td className="py-3 px-4 font-bold text-text-primary">
                        {feat}
                      </td>
                      <td className="py-3 px-4 font-mono text-text-secondary font-medium">
                        Postgres / RLS
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] bg-[#D4DDFF]/70 dark:bg-[#D4DDFF]/20 text-[#000000] dark:text-[#D4DDFF] text-[11px] font-mono font-bold border border-[#7C95EA]/40 dark:border-[#D4DDFF]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#3B82F6] dark:text-[#D4DDFF]" />
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-secondary font-medium">
                        Sonnet 3.7 Continuous Sync
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-[#3B82F6] dark:text-[#D4DDFF] hover:underline font-bold">
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-bg flex items-center justify-center text-accent text-sm">Loading workspace...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
