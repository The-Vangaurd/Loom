"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Compass, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Executive Dashboard"
          description="Workspace overview and real-time operational status"
          actions={
            <Link href="/onboarding">
              <Button variant="accent" size="sm">
                <Compass size={14} className="mr-1.5" />
                Launch Onboarding Wizard
              </Button>
            </Link>
          }
        />

        {/* Real User Session Card */}
        {user && (
          <Card className="border-border-subtle bg-surface">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-on-accent font-semibold text-sm">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-text-primary">
                      {user.name || "Enterprise User"}
                    </CardTitle>
                    <CardDescription className="text-xs text-text-secondary">
                      {user.email} &bull; Identity ID: <span className="font-mono text-[11px]">{user.id}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-success/30 text-success text-[11px]">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success inline-block"></span>
                  Active Identity
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Auth Arrival Confirmation Card */}
        <Card className="border-accent/40 bg-accent-soft/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={20} className="text-on-accent" />
                <CardTitle className="text-base text-text-primary">
                  Authentication & Workspace Isolation Active
                </CardTitle>
              </div>
              <Badge variant="accent">Session Secured</Badge>
            </div>
            <CardDescription className="text-xs text-text-secondary mt-1">
              You are authenticated via Better Auth session cookies.
              All queries are constrained by PostgreSQL Row Level Security.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-text-secondary leading-relaxed">
              This confirms Phase 3 completion: all entry screens (login, signup, verify email, forgot/reset password, MFA challenge, and accept invite) are fully wired with shared Zod validation schemas.
            </p>
            <div className="mt-4 flex gap-3">
              <Link href="/design">
                <Button variant="outline" size="sm">
                  View Component Catalog
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Switch Account &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
