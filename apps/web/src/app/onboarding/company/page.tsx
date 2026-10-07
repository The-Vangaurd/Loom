"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadCloud, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanyStepPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("Acme Industrial Corp");
  const [taxId, setTaxId] = useState("GSTIN-29AAACA1234F1Z5");
  const [currency, setCurrency] = useState("USD");
  const [fiscalStart, setFiscalStart] = useState("April 01");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Company Legal Profile</h2>
        <p className="text-sm text-text-secondary mt-1">
          Configure financial reporting parameters, tax identity, and workspace branding.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {/* Logo Dropzone Placeholder */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Company Logo (Brand Mark)
          </label>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-strong rounded-lg bg-surface-2/40 hover:bg-surface-2 transition-colors cursor-pointer text-center">
            <UploadCloud size={28} className="text-text-tertiary mb-1" />
            <p className="text-xs font-medium text-text-primary">Click to upload or drag SVG, PNG, or WebP</p>
            <p className="text-[11px] text-text-tertiary mt-0.5">Maximum file size 2MB (stored on Cloudflare R2)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Legal Entity Name
            </label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Tax Registration Number (GSTIN / VAT)
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
              Fiscal Year Start
            </label>
            <Input value={fiscalStart} onChange={(e) => setFiscalStart(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/industry")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <Button variant="accent" onClick={() => router.push("/onboarding/modules")}>
          Continue to Modules
          <ArrowRight size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
