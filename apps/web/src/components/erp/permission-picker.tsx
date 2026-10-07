"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PermissionGroup {
  resource: string;
  name: string;
  description: string;
  actions: Array<{
    id: string;
    action: string;
    label: string;
    description: string;
  }>;
}

interface PermissionPickerProps {
  groups: PermissionGroup[];
  selectedPermissions: string[];
  onChange: (selected: string[]) => void;
  readOnly?: boolean;
  className?: string;
}

export function PermissionPicker({
  groups,
  selectedPermissions,
  onChange,
  readOnly = false,
  className,
}: PermissionPickerProps) {
  const togglePermission = (id: string) => {
    if (readOnly) return;
    if (selectedPermissions.includes(id)) {
      onChange(selectedPermissions.filter((p) => p !== id));
    } else {
      onChange([...selectedPermissions, id]);
    }
  };

  const toggleGroup = (group: PermissionGroup) => {
    if (readOnly) return;
    const groupActionIds = group.actions.map((a) => a.id);
    const allSelected = groupActionIds.every((id) => selectedPermissions.includes(id));

    if (allSelected) {
      onChange(selectedPermissions.filter((id) => !groupActionIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedPermissions, ...groupActionIds]));
      onChange(merged);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {groups.map((group) => {
        const groupActionIds = group.actions.map((a) => a.id);
        const allSelected = groupActionIds.every((id) => selectedPermissions.includes(id));
        const someSelected =
          !allSelected && groupActionIds.some((id) => selectedPermissions.includes(id));

        return (
          <Card key={group.resource} className="border-border-subtle bg-surface-1">
            <CardHeader className="py-3 px-4 border-b border-border-subtle bg-surface-2/40 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-semibold text-text-primary">
                  {group.name}
                </CardTitle>
                <p className="text-xs text-text-secondary mt-0.5">{group.description}</p>
              </div>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => toggleGroup(group)}
                className="text-xs text-accent hover:underline disabled:opacity-50"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.actions.map((action) => {
                const isChecked = selectedPermissions.includes(action.id);
                return (
                  <div
                    key={action.id}
                    onClick={() => togglePermission(action.id)}
                    className={cn(
                      "flex items-start space-x-3 p-2 rounded-md border transition-colors cursor-pointer select-none",
                      isChecked
                        ? "border-accent/40 bg-accent-soft/30"
                        : "border-border-subtle bg-surface-1 hover:bg-surface-hover"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => togglePermission(action.id)}
                      disabled={readOnly}
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-text-primary leading-none">
                        {action.label}
                      </div>
                      <div className="text-[11px] text-text-secondary leading-snug">
                        {action.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
