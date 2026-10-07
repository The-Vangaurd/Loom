"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  actionHref?: string;
}

interface ChecklistCardProps {
  title: string;
  items: ChecklistItem[];
  onToggleItem?: (id: string) => void;
  className?: string;
}

export function ChecklistCard({
  title,
  items,
  onToggleItem,
  className,
}: ChecklistCardProps) {
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = (completedCount / items.length) * 100;

  return (
    <Card className={cn("border-border-subtle bg-surface-1", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-text-primary">{title}</CardTitle>
            <CardDescription className="text-xs">
              {completedCount} of {items.length} onboarding tasks finished
            </CardDescription>
          </div>
          <span className="text-xs font-mono font-semibold text-accent">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="mt-2 h-1.5" />
      </CardHeader>
      <CardContent className="space-y-2 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem && onToggleItem(item.id)}
            className={cn(
              "group flex items-start space-x-3 p-2 rounded-md transition-colors cursor-pointer select-none",
              item.completed
                ? "bg-surface-2/40 text-text-tertiary"
                : "hover:bg-surface-2 text-text-primary"
            )}
          >
            {item.completed ? (
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <Circle size={16} className="text-border-strong group-hover:text-text-primary mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <div
                className={cn(
                  "text-xs font-medium",
                  item.completed && "line-through text-text-tertiary"
                )}
              >
                {item.title}
              </div>
              {item.description && (
                <div className="text-[11px] text-text-tertiary leading-snug">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
