"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, ArrowLeft, UploadCloud, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImportStepPage() {
  const router = useRouter();
  const [fileUploaded, setFileUploaded] = useState(true);

  const mockColumns = [
    { source: "sku_code", target: "SKU / Part Number", sample: "WH-BRG-4402" },
    { source: "item_description", target: "Description", sample: "Steel Ball Bearing (12mm)" },
    { source: "qty_on_hand", target: "Opening Stock", sample: "1,250" },
    { source: "unit_cost_usd", target: "Standard Cost", sample: "$14.50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Data Import &amp; Opening Balances</h2>
        <p className="text-sm text-text-secondary mt-1">
          Upload spreadsheets from QuickBooks, Tally, or legacy ERPs. Loom runs a transactional dry-run with rollback protection.
        </p>
      </div>

      {fileUploaded ? (
        <div className="space-y-4">
          <Card className="p-4 border-border-subtle bg-surface-1">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet size={18} className="text-accent" />
                <div>
                  <span className="text-xs font-semibold text-text-primary">warehouse_inventory_skus.csv</span>
                  <span className="text-[10px] text-text-tertiary ml-2">8,500 rows detected (2.4 MB)</span>
                </div>
              </div>
              <Badge variant="accent">Mapped Automatically</Badge>
            </div>

            <div className="pt-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Column Mapping Specification
              </span>
              <div className="mt-2 rounded-md border border-border-subtle overflow-hidden">
                <Table>
                  <TableHeader className="bg-surface-2/60">
                    <TableRow>
                      <TableHead>CSV Header</TableHead>
                      <TableHead>Target ERP Field</TableHead>
                      <TableHead>Preview Sample</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockColumns.map((col, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">{col.source}</TableCell>
                        <TableCell className="text-xs font-medium text-text-primary">{col.target}</TableCell>
                        <TableCell className="text-xs text-text-secondary">{col.sample}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

          {/* Dry Run Summary Card */}
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-text-primary">Dry-Run Simulation Complete</h4>
                <p className="text-[11px] text-text-secondary">
                  8,488 rows will be created in opening inventory batches. 12 rows skipped. Zero validation errors.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono text-emerald-500 bg-emerald-500/10 border-0">
              100% VALID
            </Badge>
          </div>
        </div>
      ) : (
        <Card className="p-8 border-dashed border-2 border-border-strong text-center flex flex-col items-center justify-center cursor-pointer hover:bg-surface-2 transition-colors">
          <UploadCloud size={32} className="text-text-tertiary mb-2" />
          <p className="text-sm font-medium text-text-primary">Click to select CSV or Excel export</p>
          <p className="text-xs text-text-tertiary mt-1">Maximum 50,000 rows per batch</p>
        </Card>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/invite")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={() => router.push("/onboarding/done")}>
            Skip Data Import
          </Button>
          <Button variant="accent" onClick={() => router.push("/onboarding/done")}>
            Commit Import &amp; Finalize
            <ArrowRight size={15} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
