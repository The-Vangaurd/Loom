"use client";

import { useState } from "react";
import { initialMockTeams } from "@/../mocks/teams";
import { TreeView, TreeNode } from "@/components/erp/tree-view";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamsStepPage() {
  const router = useRouter();
  const [treeData, setTreeData] = useState<TreeNode[]>(initialMockTeams);

  const handleAddChild = (parentId: string) => {
    const unitName = prompt("Enter sub-division or team name:");
    if (!unitName) return;

    const addRecursive = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          const newChild: TreeNode = {
            id: `team-${Date.now()}`,
            name: unitName,
            type: "team",
            count: 0,
          };
          return {
            ...node,
            children: [...(node.children || []), newChild],
          };
        }
        if (node.children) {
          return { ...node, children: addRecursive(node.children) };
        }
        return node;
      });
    };

    setTreeData(addRecursive(treeData));
  };

  const handleRename = (id: string, newName: string) => {
    const renameRecursive = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === id) return { ...node, name: newName };
        if (node.children) return { ...node, children: renameRecursive(node.children) };
        return node;
      });
    };
    setTreeData(renameRecursive(treeData));
  };

  const handleDelete = (id: string) => {
    const deleteRecursive = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if (node.children) return { ...node, children: deleteRecursive(node.children) };
          return node;
        });
    };
    setTreeData(deleteRecursive(treeData));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Configure Organization &amp; Teams</h2>
        <p className="text-sm text-text-secondary mt-1">
          Loom uses Postgres <code className="font-mono text-accent">ltree</code> paths for hierarchical delegation. A role granted at a parent team applies to all sub-teams automatically.
        </p>
      </div>

      <Card className="p-4 border-border-subtle bg-surface-1">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Organization Structure
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddChild("corp-root")}
          >
            <Plus size={13} className="mr-1.5" />
            Add Top Division
          </Button>
        </div>

        <TreeView
          data={treeData}
          onAddChild={handleAddChild}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/modules")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <Button variant="accent" onClick={() => router.push("/onboarding/roles")}>
          Continue to Roles
          <ArrowRight size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
