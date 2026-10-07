"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { DataTable, Column } from "@/components/erp/data-table";
import { useMembers } from "@/hooks/use-members";
import { MockMember } from "@/../mocks/members";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function MembersSettingsPage() {
  const { members, isLoading, updateMember } = useMembers();
  const [selectedMember, setSelectedMember] = useState<MockMember | null>(null);

  const columns: Column<MockMember>[] = [
    { key: "name", header: "Full Name", sortable: true },
    { key: "email", header: "Email Address", sortable: true },
    {
      key: "role",
      header: "Assigned Role",
      render: (row) => (
        <Badge variant={row.role === "Owner" ? "accent" : "secondary"}>
          {row.role}
        </Badge>
      ),
    },
    { key: "team", header: "Assigned Team" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`text-xs font-semibold ${
            row.status === "Active"
              ? "text-emerald-500"
              : row.status === "Pending"
              ? "text-amber-500"
              : "text-danger"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedMember(row)}
          className="text-text-tertiary hover:text-text-primary"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Workspace Members"
          description="Manage active employee credentials, role permissions, and team assignments via TanStack Query."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Members" },
          ]}
          actions={
            <Button variant="accent" size="sm" onClick={() => alert("Invite modal opened")}>
              <UserPlus size={14} className="mr-1.5" />
              Invite Member
            </Button>
          }
        />

        <DataTable
          data={members}
          columns={columns}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search employees by name..."
        />

        {/* Slide-out Sheet for Editing Member */}
        <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Member Profile &amp; Role</SheetTitle>
              <SheetDescription>
                Update role assignment and organizational team scope.
              </SheetDescription>
            </SheetHeader>
            {selectedMember && (
              <div className="space-y-4 mt-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Name</label>
                  <Input defaultValue={selectedMember.name} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Email</label>
                  <Input defaultValue={selectedMember.email} disabled />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Role</label>
                  <Input defaultValue={selectedMember.role} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Team</label>
                  <Input defaultValue={selectedMember.team} />
                </div>
                <div className="pt-4 flex gap-2">
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => {
                      updateMember.mutate(selectedMember);
                      setSelectedMember(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </AppShell>
  );
}
