"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { DataTable, Column } from "@/components/erp/data-table";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { MockAuditEntry } from "@/../mocks/audit-logs";
import { Badge } from "@/components/ui/badge";

export default function AuditLogSettingsPage() {
  const { data: auditLogs = [], isLoading } = useAuditLogs();

  const columns: Column<MockAuditEntry>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row) => <span className="font-mono text-xs text-text-secondary">{row.timestamp}</span>,
    },
    { key: "actor", header: "Actor", sortable: true },
    {
      key: "action",
      header: "Action",
      render: (row) => <Badge variant="outline" className="font-mono text-[10px]">{row.action}</Badge>,
    },
    {
      key: "resource",
      header: "Target Resource",
      render: (row) => <span className="font-mono text-xs text-text-primary">{row.resource}</span>,
    },
    {
      key: "ipAddress",
      header: "Origin IP",
      render: (row) => <span className="font-mono text-xs text-text-tertiary">{row.ipAddress}</span>,
    },
    {
      key: "status",
      header: "Security Result",
      render: (row) => (
        <span
          className={`text-xs font-semibold ${
            row.status === "Success" ? "text-emerald-500" : "text-danger"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Append-Only Security Audit Trail"
          description="Immutable record of administrative operations fetched via useAuditLogs."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Audit Log" },
          ]}
        />

        <div className="p-3 rounded-lg bg-surface-2/60 border border-border-subtle text-xs text-text-secondary flex items-center justify-between">
          <span>
            Database Enforcement: The application role has <code className="font-mono text-text-primary">UPDATE</code> and <code className="font-mono text-text-primary">DELETE</code> privileges revoked on this table.
          </span>
          <Badge variant="accent">WORM Compliant</Badge>
        </div>

        <DataTable
          data={auditLogs}
          columns={columns}
          isLoading={isLoading}
          searchKey="action"
          searchPlaceholder="Filter audit records by action..."
        />
      </div>
    </AppShell>
  );
}
