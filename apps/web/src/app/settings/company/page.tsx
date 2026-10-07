"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, Check, Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/use-company";

export default function CompanySettingsPage() {
  const { profile, isLoading, updateProfile } = useCompany();
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.name || "");
      setTaxId(profile.taxId || "");
      setCurrency(profile.currency || "USD");
      setTimezone(profile.timezone || "UTC");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: companyName,
        taxId: taxId || null,
        currency,
        timezone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Handled by react query error state
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Company Legal Profile"
          description="Manage workspace identity, corporate tax registration, and primary ledger parameters."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Company Profile" },
          ]}
          actions={
            <Button variant="accent" size="sm" onClick={handleSave}>
              {saved ? <Check size={14} className="mr-1.5" /> : null}
              {saved ? "Saved Changes" : "Save Changes"}
            </Button>
          }
        />

        <Card className="p-6 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Corporate Brand Mark
            </span>
            <div className="flex items-center space-x-4 pt-1">
              <div className="h-16 w-16 rounded-lg bg-surface-2 border border-border-strong flex items-center justify-center font-mono font-bold text-2xl text-text-primary">
                A
              </div>
              <div className="p-4 flex-1 border-2 border-dashed border-border-strong rounded-lg bg-surface-2/30 hover:bg-surface-2 transition-colors cursor-pointer text-center">
                <UploadCloud size={20} className="text-text-tertiary mx-auto mb-1" />
                <p className="text-xs font-medium text-text-primary">Upload new logo image</p>
                <p className="text-[10px] text-text-tertiary">PNG, SVG or WebP up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Company Legal Name
              </label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Tax Registration Number (GSTIN/VAT)
              </label>
              <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Functional Currency
              </label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Workspace Timezone
              </label>
              <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
