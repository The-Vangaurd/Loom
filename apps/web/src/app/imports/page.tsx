"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { DataTable, Column } from "@/components/erp/data-table";
import { mockImportBatches, MockImportBatch } from "@/../mocks/imports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ImportsPage() {
  const columns: Column<MockImportBatch>[] = [
    {
      key: "filename",
      header: "Source Filename",
      render: (row) => <span className="font-mono text-xs font-semibold text-text-primary">{row.filename}</span>,
    },
    { key: "module", header: "Target Module" },
    {
      key: "rowCount",
      header: "Processed Rows",
      render: (row) => (
        <span className="font-mono text-xs">
          {row.successCount} / {row.rowCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "Completed" ? "secondary" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
    { key: "createdAt", header: "Import Date" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Batch ${row.id} rollback requested`)}
          className="text-text-tertiary hover:text-danger hover:bg-danger-soft text-xs"
        >
          <RotateCcw size={12} className="mr-1" />
          Rollback
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Data Import Pipelines"
          description="Batch import history with transactional dry-run summaries and single-click rollback protection."
          breadcrumbs={[
            { label: "Operations" },
            { label: "Imports" },
          ]}
          actions={
            <Link href="/onboarding/import">
              <Button variant="accent" size="sm">
                <UploadCloud size={14} className="mr-1.5" />
                New Data Import
              </Button>
            </Link>
          }
        />

        <DataTable
          data={mockImportBatches}
          columns={columns}
          searchKey="filename"
          searchPlaceholder="Search imports by filename..."
        />
      </div>
    </AppShell>
  );
}
