"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/erp/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TreeView, TreeNode } from "@/components/erp/tree-view";
import { useTeams } from "@/hooks/use-teams";
import { Plus, GitFork, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function TeamsSettingsPage() {
  const { teams, isLoading, createTeam, moveTeam, deleteTeam } = useTeams();

  // Create Modal State
  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [parentUnitId, setParentUnitId] = useState<string | null>(null);

  // Move Modal State
  const [moveOpen, setMoveOpen] = useState(false);
  const [targetMoveNodeId, setTargetMoveNodeId] = useState<string | null>(null);
  const [newParentUnitId, setNewParentUnitId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flatten all nodes for parent select dropdowns
  const flattenNodes = (nodes: TreeNode[]): { id: string; name: string }[] => {
    const res: { id: string; name: string }[] = [];
    const traverse = (list: TreeNode[], prefix = "") => {
      for (const item of list) {
        res.push({ id: item.id, name: prefix ? `${prefix} / ${item.name}` : item.name });
        if (item.children) {
          traverse(item.children, prefix ? `${prefix} / ${item.name}` : item.name);
        }
      }
    };
    traverse(nodes);
    return res;
  };

  const allAvailableUnits = flattenNodes(teams);

  const handleAddChild = (parentId: string) => {
    setParentUnitId(parentId);
    setNewTeamName("");
    setCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!newTeamName.trim()) return;
    try {
      await createTeam.mutateAsync({
        name: newTeamName.trim(),
        parentId: parentUnitId,
      });
      setCreateOpen(false);
      setNewTeamName("");
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create organizational unit");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this organizational unit?")) {
      try {
        await deleteTeam.mutateAsync(id);
      } catch (err: any) {
        alert(err?.message || "Cannot delete unit with sub-teams or members");
      }
    }
  };

  const handleOpenMove = (nodeId: string) => {
    setTargetMoveNodeId(nodeId);
    setNewParentUnitId(allAvailableUnits[0]?.id || "");
    setErrorMessage(null);
    setMoveOpen(true);
  };

  const handleMoveSubmit = async () => {
    if (!targetMoveNodeId || !newParentUnitId) return;
    setErrorMessage(null);
    try {
      await moveTeam.mutateAsync({
        unitId: targetMoveNodeId,
        newParentId: newParentUnitId,
      });
      setMoveOpen(false);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to move team");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Organizational Units & Teams"
          description="Hierarchical structure managed by PostgreSQL native ltree extension with transactional move operations."
          breadcrumbs={[
            { label: "Settings", href: "/settings/company" },
            { label: "Teams Hierarchy" },
          ]}
          actions={
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setParentUnitId(null);
                setNewTeamName("");
                setCreateOpen(true);
              }}
            >
              <Plus size={14} className="mr-1.5" />
              Add Department
            </Button>
          }
        />

        {/* Hierarchy Information Banner */}
        <Card className="border-accent/40 bg-accent-soft/20 shadow-xs">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck size={18} className="text-on-accent" />
                <CardTitle className="text-sm font-semibold text-text-primary">
                  PostgreSQL ltree Hierarchy Active
                </CardTitle>
              </div>
              <Badge variant="accent">RLS Enforced</Badge>
            </div>
            <CardDescription className="text-xs text-text-secondary mt-1">
              Teams are indexed with GiST trees. Moving a team atomically recalculates all descendant paths across arbitrary depths in a single SQL statement.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tree View Canvas */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Corporate Tree Structure</h3>
              <p className="text-xs text-text-secondary">
                Click + on any department to nest sub-teams. Use the move action to reparent.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-text-tertiary">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm">Loading organizational hierarchy...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <TreeView
                data={teams}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Create Team Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organizational Unit</DialogTitle>
            <DialogDescription>
              Create a new department, team, or operational cell.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {errorMessage && (
              <div className="rounded bg-danger-soft p-2.5 text-xs text-danger">
                {errorMessage}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Team Name
              </label>
              <Input
                placeholder="e.g. Quality Assurance or EMEA Sales"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleCreateSubmit}
              isLoading={createTeam.isPending}
            >
              Create Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Team Dialog */}
      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Organizational Unit</DialogTitle>
            <DialogDescription>
              Reparent this team and all its descendant units under a new parent department.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {errorMessage && (
              <div className="rounded bg-danger-soft p-2.5 text-xs text-danger">
                {errorMessage}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Target Parent Department
              </label>
              <select
                className="w-full rounded-md border border-border-strong bg-surface p-2 text-xs text-text-primary focus:outline-hidden focus:ring-1 focus:ring-accent"
                value={newParentUnitId}
                onChange={(e) => setNewParentUnitId(e.target.value)}
              >
                {allAvailableUnits
                  .filter((u) => u.id !== targetMoveNodeId)
                  .map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setMoveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={handleMoveSubmit}
              isLoading={moveTeam.isPending}
            >
              Move Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
