"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DoneStepPage() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 shadow-md">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Workspace Setup Complete!</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">Acme Industrial Corp</span> is configured with Row-Level Security, organizational teams, starter roles, and opening balances.
        </p>
      </div>

      <Card className="w-full max-w-lg p-5 border-border-subtle bg-surface-1 text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-3">
          Configuration Manifest
        </span>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded bg-surface-2 border border-border-subtle">
            <span className="text-[10px] text-text-tertiary uppercase">Vertical</span>
            <p className="font-semibold text-text-primary mt-0.5">Manufacturing &amp; Logistics</p>
          </div>
          <div className="p-2.5 rounded bg-surface-2 border border-border-subtle">
            <span className="text-[10px] text-text-tertiary uppercase">Isolation</span>
            <p className="font-semibold text-emerald-500 mt-0.5">Fail-Closed RLS</p>
          </div>
          <div className="p-2.5 rounded bg-surface-2 border border-border-subtle">
            <span className="text-[10px] text-text-tertiary uppercase">Organization</span>
            <p className="font-semibold text-text-primary mt-0.5">3 Sub-Divisions Active</p>
          </div>
          <div className="p-2.5 rounded bg-surface-2 border border-border-subtle">
            <span className="text-[10px] text-text-tertiary uppercase">Active Modules</span>
            <p className="font-semibold text-text-primary mt-0.5">Inventory, Billing, POs</p>
          </div>
        </div>
      </Card>

      <div className="pt-2">
        <Link href="/dashboard">
          <Button variant="accent" size="lg" className="shadow-lg">
            <LayoutDashboard size={16} className="mr-2" />
            Enter ERP Dashboard
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
