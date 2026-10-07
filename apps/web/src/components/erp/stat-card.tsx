import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  description,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border-subtle bg-surface-1", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</p>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-text-tertiary">
              <Icon size={16} />
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-text-primary">{value}</span>
          {change && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-emerald-500" : "text-danger"
              )}
            >
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-text-tertiary">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
