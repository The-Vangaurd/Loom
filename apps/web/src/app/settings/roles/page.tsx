"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { PermissionPicker, PermissionGroup } from "@/components/erp/permission-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus } from "lucide-react";

const mockGroups: PermissionGroup[] = [
  {
    resource: "inventory",
    name: "Inventory Management",
    description: "Access warehouse stock, items, lots, and ledger adjustments",
    actions: [
      { id: "inventory.items.read", action: "read", label: "View Items", description: "Read stock levels" },
      { id: "inventory.items.write", action: "write", label: "Edit Items", description: "Create or modify SKUs" },
      { id: "inventory.items.delete", action: "delete", label: "Delete Items", description: "Archive items from catalog" },
    ],
  },
  {
    resource: "invoicing",
    name: "Invoicing & Financials",
    description: "Manage accounts receivable, customer billings, and payment receipts",
    actions: [
      { id: "invoicing.invoices.read", action: "read", label: "View Invoices", description: "Read ledger invoices" },
      { id: "invoicing.invoices.create", action: "create", label: "Create Invoices", description: "Issue billing docs" },
      { id: "invoicing.invoices.void", action: "void", label: "Void Invoices", description: "Cancel posted invoices" },
    ],
  },
];

export default function RolesSettingsPage() {
  const [activeRole, setActiveRole] = useState("Finance Manager");
  const [perms, setPerms] = useState<Record<string, string[]>>({
    "Owner": ["inventory.items.read", "inventory.items.write", "inventory.items.delete", "invoicing.invoices.read", "invoicing.invoices.create", "invoicing.invoices.void"],
    "Finance Manager": ["invoicing.invoices.read", "invoicing.invoices.create"],
    "Auditor": ["inventory.items.read", "invoicing.invoices.read"],
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Role Permissions Matrix"
          description="Define custom authorization templates. Permissions are verified strictly on the backend."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Roles & Permissions" },
          ]}
          actions={
            <Button variant="accent" size="sm" onClick={() => alert("Create role dialog")}>
              <Plus size={14} className="mr-1.5" />
              Create Custom Role
            </Button>
          }
        />

        <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
          {Object.keys(perms).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeRole === role
                  ? "bg-surface-2 text-text-primary border border-border-strong font-semibold shadow-xs"
                  : "text-text-secondary hover:bg-surface-hover"
              }`}
            >
              <Shield size={13} className={activeRole === role ? "text-accent" : "text-text-tertiary"} />
              <span>{role}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                {perms[role].length}
              </Badge>
            </button>
          ))}
        </div>

        <PermissionPicker
          groups={mockGroups}
          selectedPermissions={perms[activeRole] || []}
          onChange={(newPerms) => setPerms({ ...perms, [activeRole]: newPerms })}
        />
      </div>
    </AppShell>
  );
}
