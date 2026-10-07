"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Folder, Users, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TreeNode {
  id: string;
  name: string;
  type: "team" | "unit";
  count?: number;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
  onAddChild?: (parentId: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function TreeView({ data, onAddChild, onRename, onDelete, className }: TreeViewProps) {
  return (
    <div className={cn("space-y-1 font-sans text-sm", className)}>
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          onAddChild={onAddChild}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function TreeItem({
  node,
  level,
  onAddChild,
  onRename,
  onDelete,
}: {
  node: TreeNode;
  level: number;
  onAddChild?: (parentId: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(node.name);

  const hasChildren = node.children && node.children.length > 0;

  const handleSaveRename = () => {
    setIsEditing(false);
    if (onRename && name.trim() && name !== node.name) {
      onRename(node.id, name);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center justify-between rounded-md py-1.5 px-2 hover:bg-surface-2 transition-colors",
          level > 0 && "ml-4 border-l border-border-subtle pl-2"
        )}
      >
        <div className="flex items-center space-x-2 flex-1">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-0.5 rounded text-text-tertiary hover:text-text-primary"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {node.type === "team" ? (
            <Users size={15} className="text-accent" />
          ) : (
            <Folder size={15} className="text-text-tertiary" />
          )}

          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={(e) => e.key === "Enter" && handleSaveRename()}
              autoFocus
              className="h-6 rounded border border-accent bg-surface-1 px-1.5 text-xs text-text-primary focus:outline-none"
            />
          ) : (
            <span className="font-medium text-text-primary text-xs">{node.name}</span>
          )}

          {node.count !== undefined && (
            <span className="rounded bg-surface-3 px-1.5 py-0.2 text-[10px] text-text-tertiary">
              {node.count}
            </span>
          )}
        </div>

        {/* Hover action toolbar */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
          {onAddChild && (
            <button
              onClick={() => onAddChild(node.id)}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-3"
              title="Add sub-team"
            >
              <Plus size={13} />
            </button>
          )}
          {onRename && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-3"
              title="Rename"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(node.id)}
              className="p-1 rounded text-text-tertiary hover:text-danger hover:bg-danger-soft"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="mt-0.5">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onAddChild={onAddChild}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
