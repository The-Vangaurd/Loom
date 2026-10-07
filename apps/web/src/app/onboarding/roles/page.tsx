"use client";

import { useState } from "react";
import { PermissionPicker, PermissionGroup } from "@/components/erp/permission-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const mockPermissionGroups: PermissionGroup[] = [
  {
    resource: "inventory",
    name: "Inventory & Warehouses",
    description: "Manage product catalogs, warehouse lots, and stock balance adjustments",
    actions: [
      { id: "inventory.items.read", action: "read", label: "View Stock Items", description: "Inspect SKU levels and warehouse bins" },
      { id: "inventory.items.write", action: "write", label: "Modify SKUs", description: "Create or update inventory metadata" },
      { id: "inventory.adjust.execute", action: "execute", label: "Adjust Inventory", description: "Post variance entries to general ledger" },
    ],
  },
  {
    resource: "invoicing",
    name: "Sales & Invoicing",
    description: "Generate customer quotations, tax invoices, and credit memos",
    actions: [
      { id: "invoicing.invoices.read", action: "read", label: "View Invoices", description: "Read issued billing documents" },
      { id: "invoicing.invoices.create", action: "create", label: "Create Invoices", description: "Draft and post sales invoices" },
      { id: "invoicing.invoices.void", action: "void", label: "Void Invoices", description: "Cancel invoices with credit memo trail" },
    ],
  },
  {
    resource: "procurement",
    name: "Purchasing & Vendor POs",
    description: "Manage supplier purchase orders and 3-way invoice matching",
    actions: [
      { id: "procurement.po.read", action: "read", label: "View Purchase Orders", description: "Read outgoing vendor orders" },
      { id: "procurement.po.approve", action: "approve", label: "Approve POs", description: "Authorize company funds commitment" },
    ],
  },
];

export default function RolesStepPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("Finance Manager");
  const [permissions, setPermissions] = useState<Record<string, string[]>>({
    "Finance Manager": ["invoicing.invoices.read", "invoicing.invoices.create", "procurement.po.read", "procurement.po.approve"],
    "Warehouse Lead": ["inventory.items.read", "inventory.items.write", "inventory.adjust.execute"],
    "Auditor": ["inventory.items.read", "invoicing.invoices.read", "procurement.po.read"],
  });

  const currentRolePerms = permissions[activeRole] || [];

  const handlePermsChange = (newPerms: string[]) => {
    setPermissions((prev) => ({ ...prev, [activeRole]: newPerms }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Starter Roles &amp; Permissions</h2>
        <p className="text-sm text-text-secondary mt-1">
          Review starter role templates. Loom uses fine-grained <code className="font-mono text-accent">module.resource.action</code> permissions.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-border-subtle pb-3">
        {Object.keys(permissions).map((role) => (
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
              {permissions[role].length}
            </Badge>
          </button>
        ))}
      </div>

      <PermissionPicker
        groups={mockPermissionGroups}
        selectedPermissions={currentRolePerms}
        onChange={handlePermsChange}
      />

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/teams")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <Button variant="accent" onClick={() => router.push("/onboarding/invite")}>
          Continue to Invitations
          <ArrowRight size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
