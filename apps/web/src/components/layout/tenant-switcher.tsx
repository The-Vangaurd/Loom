"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TenantOption {
  id: string;
  name: string;
  plan: string;
}

interface TenantSwitcherProps {
  tenants: TenantOption[];
  activeTenantId: string;
  onSelectTenant: (id: string) => void;
  onNewTenant?: () => void;
  className?: string;
}

export function TenantSwitcher({
  tenants,
  activeTenantId,
  onSelectTenant,
  onNewTenant,
  className,
}: TenantSwitcherProps) {
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("w-full focus:outline-none", className)}>
        <div className="flex items-center justify-between p-2 rounded-lg border border-border-subtle bg-surface-1 hover:bg-surface-hover transition-colors text-left">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/20 border border-accent/40 text-on-accent font-bold text-xs">
              {activeTenant?.name?.charAt(0) || "T"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-text-primary leading-tight">
                {activeTenant?.name || "Select Tenant"}
              </p>
              <p className="truncate text-[10px] text-text-tertiary uppercase tracking-wider">
                {activeTenant?.plan || "Free"} Plan
              </p>
            </div>
          </div>
          <ChevronsUpDown size={14} className="text-text-tertiary shrink-0 ml-1" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Tenants & Workspaces</DropdownMenuLabel>
        {tenants.map((tenant) => {
          const isSelected = tenant.id === activeTenantId;
          return (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => onSelectTenant(tenant.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Building2 size={14} className="text-text-tertiary" />
                <span className="font-medium text-xs">{tenant.name}</span>
              </div>
              {isSelected && <Check size={14} className="text-accent" />}
            </DropdownMenuItem>
          );
        })}
        {onNewTenant && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onNewTenant} className="text-accent font-medium">
              <Plus size={14} className="mr-2" />
              <span>Create New Tenant</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
