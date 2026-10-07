"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBilling } from "@/hooks/use-billing";
import { Download, Sparkles } from "lucide-react";

export default function BillingSettingsPage() {
  const { subscription, invoices, isLoading } = useBilling();

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Subscription &amp; Billing"
          description="Manage active tier plan, seat allocation, and download historical tax invoices via useBilling."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Billing & Plans" },
          ]}
          actions={
            <Button variant="accent" size="sm" onClick={() => alert("Upgrade plan modal")}>
              <Sparkles size={14} className="mr-1.5" />
              Upgrade Plan
            </Button>
          }
        />

        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-accent/40 bg-accent-soft/20 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
                  Current Tier
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-0.5">{subscription.planName}</h3>
                <p className="text-xs text-text-secondary mt-1">Renews on {subscription.renewalDate}</p>
              </div>
              <Badge variant="accent">Active</Badge>
            </div>
          </Card>

          <Card className="p-4 border-border-subtle bg-surface-1 flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">
              Billing Amount
            </span>
            <span className="text-2xl font-bold text-text-primary mt-1">{subscription.price}</span>
            <span className="text-[11px] text-text-tertiary">Billed annually</span>
          </Card>
        </div>

        {/* Resource Usage Progress */}
        <Card className="p-5 border-border-subtle bg-surface-1 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
            Plan Capacity &amp; Limits
          </span>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-primary font-medium">Team Member Seats</span>
              <span className="text-text-secondary font-mono">
                {subscription.seatsUsed} / {subscription.seatsTotal} Seats Used
              </span>
            </div>
            <Progress value={(subscription.seatsUsed / subscription.seatsTotal) * 100} />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-primary font-medium">Cloudflare R2 Document Storage</span>
              <span className="text-text-secondary font-mono">
                {subscription.storageUsedGB} GB / {subscription.storageTotalGB} GB Consumed
              </span>
            </div>
            <Progress value={(subscription.storageUsedGB / subscription.storageTotalGB) * 100} />
          </div>
        </Card>

        {/* Invoices Table */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
            Billing History &amp; GST Invoices
          </span>
          <div className="rounded-lg border border-border-subtle bg-surface-1 overflow-hidden">
            <Table>
              <TableHeader className="bg-surface-2/60">
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs font-medium text-text-primary">
                      {inv.number}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">{inv.date}</TableCell>
                    <TableCell className="text-xs font-semibold text-text-primary">{inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-emerald-500 bg-emerald-500/10 border-0">
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => alert(`Downloading ${inv.number}`)}>
                        <Download size={13} className="mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
