"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users2,
  Settings,
  ShieldAlert,
  ArrowDownToLine,
  CreditCard,
  Layers,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { TenantSwitcher, TenantOption } from "./tenant-switcher";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const defaultNavigation: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Onboarding Wizard", href: "/onboarding", icon: Compass, badge: "New" },
  { title: "Teams & Org", href: "/settings/teams", icon: Users2 },
  { title: "Roles & Permissions", href: "/settings/roles", icon: ShieldAlert },
  { title: "Data Imports", href: "/imports", icon: ArrowDownToLine },
  { title: "Billing & Plans", href: "/settings/billing", icon: CreditCard },
  { title: "Company Settings", href: "/settings/company", icon: Settings },
  { title: "Design Catalog", href: "/design", icon: Layers },
];

const mockTenants: TenantOption[] = [
  { id: "tenant-acme", name: "Acme Industrial Corp", plan: "Enterprise" },
  { id: "tenant-stark", name: "Stark Logistics", plan: "Growth" },
];

const mockUser = {
  name: "Alex Vhanghar",
  email: "alex@acme.com",
  role: "Workspace Owner",
};

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [activeTenant, setActiveTenant] = React.useState("tenant-acme");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between py-4 px-3">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-border-strong text-text-primary font-mono font-bold text-base">
            L
          </div>
          <div>
            <span className="font-bold tracking-tight text-text-primary text-sm">Loom ERP</span>
            <span className="block text-[10px] font-mono text-text-tertiary">v1.0-alpha</span>
          </div>
        </div>

        {/* Tenant Switcher */}
        <TenantSwitcher
          tenants={mockTenants}
          activeTenantId={activeTenant}
          onSelectTenant={setActiveTenant}
          onNewTenant={() => alert("Create tenant modal triggered")}
        />

        {/* Navigation list */}
        <nav className="space-y-1 pt-2">
          {defaultNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-surface-2 text-text-primary font-semibold border-l-2 border-accent"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon size={16} className={isActive ? "text-accent" : "text-text-tertiary"} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-mono font-semibold text-accent">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="pt-4 border-t border-border-subtle flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <UserMenu user={mockUser} onLogout={() => alert("Logged out")} />
          <div className="overflow-hidden">
            <p className="truncate text-xs font-medium text-text-primary">{mockUser.name}</p>
            <p className="truncate text-[10px] text-text-tertiary">{mockUser.role}</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border-subtle bg-surface-1 shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {SidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-border-subtle bg-surface-1 px-4 md:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-2 md:hidden"
            >
              <Menu size={18} />
            </button>
            <span className="text-xs font-mono text-text-tertiary">
              Workspace / {mockTenants.find((t) => t.id === activeTenant)?.name}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <UserMenu user={mockUser} onLogout={() => alert("Logged out")} />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
