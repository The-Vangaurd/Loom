"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Plus, Trash2, UploadCloud, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface InviteRow {
  id: string;
  email: string;
  role: string;
  team: string;
}

export default function InviteStepPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<InviteRow[]>([
    { id: "1", email: "sarah@acme.com", role: "Admin", team: "Operations & Supply" },
    { id: "2", email: "david@acme.com", role: "Finance Manager", team: "Finance & Legal" },
  ]);

  const addRow = () => {
    setInvites([
      ...invites,
      { id: String(Date.now()), email: "", role: "Member", team: "Central Warehouse" },
    ]);
  };

  const removeRow = (id: string) => {
    setInvites(invites.filter((i) => i.id !== id));
  };

  const updateRow = (id: string, field: keyof InviteRow, val: string) => {
    setInvites(invites.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Invite Core Team Members</h2>
        <p className="text-sm text-text-secondary mt-1">
          Add colleagues by email or upload a CSV. Invited users receive a tokenized signup link valid for 7 days.
        </p>
      </div>

      <Card className="p-5 border-border-subtle bg-surface-1 space-y-4">
        <div className="space-y-3">
          {invites.map((row, idx) => (
            <div key={row.id} className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                type="email"
                placeholder="colleague@acme.com"
                value={row.email}
                onChange={(e) => updateRow(row.id, "email", e.target.value)}
                className="flex-1 text-xs"
              />
              <Input
                placeholder="Assigned Role"
                value={row.role}
                onChange={(e) => updateRow(row.id, "role", e.target.value)}
                className="w-full sm:w-44 text-xs"
              />
              <Input
                placeholder="Assigned Team"
                value={row.team}
                onChange={(e) => updateRow(row.id, "team", e.target.value)}
                className="w-full sm:w-48 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeRow(row.id)}
                className="text-text-tertiary hover:text-danger hover:bg-danger-soft shrink-0"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus size={13} className="mr-1.5" />
            Add Another Colleague
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => alert("CSV bulk import modal opened")}
            className="text-text-secondary"
          >
            <UploadCloud size={14} className="mr-1.5" />
            Upload CSV List
          </Button>
        </div>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/roles")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={() => router.push("/onboarding/import")}>
            Skip for now
          </Button>
          <Button variant="accent" onClick={() => router.push("/onboarding/import")}>
            Send Invites &amp; Continue
            <ArrowRight size={15} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
