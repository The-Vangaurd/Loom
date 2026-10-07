import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
  showThemeToggle = true,
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      {showThemeToggle && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Link
            href="/design"
            className="text-xs font-mono text-text-tertiary hover:text-text-primary underline px-2 py-1"
          >
            /design
          </Link>
          <ThemeToggle />
        </div>
      )}

      <Card className={cn("w-full max-w-[420px] border-border-strong shadow-xl", className)}>
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 border border-border-strong shadow-xs">
            <span className="font-mono text-lg font-bold text-text-primary">L</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-text-primary">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-text-secondary">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4 pt-0">{children}</CardContent>
        {footer && <CardFooter className="flex flex-col space-y-2 border-t border-border-subtle pt-4">{footer}</CardFooter>}
      </Card>
    </div>
  );
}
