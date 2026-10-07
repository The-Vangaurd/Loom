"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EmptyState } from "@/components/erp/empty-state";
import { PageHeader } from "@/components/erp/page-header";
import { StepProgress } from "@/components/erp/step-progress";
import { TreeView, TreeNode } from "@/components/erp/tree-view";
import { PermissionPicker, PermissionGroup } from "@/components/erp/permission-picker";
import { DataTable, Column } from "@/components/erp/data-table";
import { StatCard } from "@/components/erp/stat-card";
import { ChecklistCard, ChecklistItem } from "@/components/erp/checklist-card";
import { ConfirmDialog } from "@/components/erp/confirm-dialog";
import { TenantSwitcher } from "@/components/layout/tenant-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import Link from "next/link";
import {
  ShieldCheck,
  Layers,
  Type,
  Palette,
  ArrowLeft,
  Users,
  CheckCircle2,
  FolderTree,
  Lock,
  Table as TableIcon,
  BarChart3,
  Sliders,
  AlertTriangle,
} from "lucide-react";

export default function DesignPage() {
  const { theme } = useTheme();

  // State controls for interactive testing
  const [btnLoading, setBtnLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("components");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([
    "tenants.read",
    "members.read",
    "members.invite",
  ]);

  // Tree View Mock
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: "root-corp",
      name: "Global Operations",
      type: "unit",
      count: 42,
      children: [
        {
          id: "team-eng",
          name: "Engineering & Architecture",
          type: "team",
          count: 18,
          children: [
            { id: "team-core", name: "Core Platform", type: "team", count: 6 },
            { id: "team-data", name: "Data & Storage", type: "team", count: 8 },
          ],
        },
        {
          id: "team-fin",
          name: "Finance & Accounts",
          type: "team",
          count: 9,
        },
      ],
    },
  ]);

  // Checklist Mock
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: "1", title: "Verify database RLS isolation policies", completed: true },
    { id: "2", title: "Setup organization tree and root divisions", completed: true },
    { id: "3", title: "Configure starter RBAC roles", completed: false },
    { id: "4", title: "Import initial inventory or chart of accounts", completed: false },
  ]);

  // Table Mock
  interface MockMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }
  const tableData: MockMember[] = [
    { id: "usr-1", name: "Alex Vhanghar", email: "alex@acme.com", role: "Owner", status: "Active" },
    { id: "usr-2", name: "Sarah Chen", email: "sarah@acme.com", role: "Admin", status: "Active" },
    { id: "usr-3", name: "David Miller", email: "david@acme.com", role: "Member", status: "Pending" },
    { id: "usr-4", name: "Elena Rostova", email: "elena@acme.com", role: "Auditor", status: "Active" },
  ];

  const tableColumns: Column<MockMember>[] = [
    { key: "name", header: "Member", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "role",
      header: "Assigned Role",
      render: (row) => (
        <Badge variant={row.role === "Owner" ? "accent" : "secondary"}>{row.role}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center text-xs font-medium ${
            row.status === "Active" ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Permission Groups Mock
  const permissionGroups: PermissionGroup[] = [
    {
      resource: "tenants",
      name: "Workspace & Company",
      description: "Manage root company profile, currency, and legal entities",
      actions: [
        { id: "tenants.read", action: "read", label: "View Profile", description: "Read company settings" },
        { id: "tenants.write", action: "write", label: "Modify Profile", description: "Edit company tax IDs and logo" },
      ],
    },
    {
      resource: "members",
      name: "Team & Memberships",
      description: "Manage user invitations, role assignments, and team hierarchy",
      actions: [
        { id: "members.read", action: "read", label: "View Members", description: "Browse active employee list" },
        { id: "members.invite", action: "invite", label: "Invite Members", description: "Send team onboarding emails" },
        { id: "members.remove", action: "remove", label: "Remove Members", description: "Revoke workspace credentials" },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <PageHeader
        title="Loom Design System & Component Library"
        description="Comprehensive visual catalog of all Phase 2 custom ERP components, UI primitives, and 4-state visual validations."
        breadcrumbs={[
          { label: "Loom ERP", href: "/login" },
          { label: "Design System" },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-mono">
              Theme: {theme}
            </Badge>
            <ThemeToggle />
          </div>
        }
      />

      {/* Tabs navigation for categories */}
      <Tabs defaultValue="erp-custom" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="erp-custom">ERP Custom Blocks</TabsTrigger>
          <TabsTrigger value="primitives">UI Primitives</TabsTrigger>
          <TabsTrigger value="overlays">Overlays & Modals</TabsTrigger>
          <TabsTrigger value="states">4 States Gallery</TabsTrigger>
        </TabsList>

        {/* ===================== TAB 1: ERP CUSTOM BLOCKS ===================== */}
        <TabsContent value="erp-custom" className="space-y-10">
          {/* Stat Cards */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <BarChart3 size={16} className="text-accent" />
              Stat & KPI Cards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Active Tenants" value="128" change="+14.2%" isPositive icon={Users} description="Since last quarter" />
              <StatCard title="Total Users" value="2,410" change="+8.1%" isPositive icon={ShieldCheck} description="Across all organizations" />
              <StatCard title="Storage Consumed" value="48.2 GB" change="+2.4 GB" isPositive={false} description="R2 Cloudflare bucket" />
              <StatCard title="Avg Latency" value="18 ms" change="-3.1 ms" isPositive icon={Sliders} description="P95 Database query time" />
            </div>
          </section>

          {/* Checklist & TreeView */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Checklist Card */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent" />
                Checklist Card (Interactive)
              </h3>
              <ChecklistCard
                title="Workspace Onboarding Progress"
                items={checklistItems}
                onToggleItem={(id) => {
                  setChecklistItems((items) =>
                    items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
                  );
                }}
              />
            </section>

            {/* TreeView */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                <FolderTree size={16} className="text-accent" />
                Organization TreeView (Teams & Units)
              </h3>
              <Card className="p-4">
                <TreeView
                  data={treeData}
                  onAddChild={(parentId) => {
                    alert(`Add child requested for parent node: ${parentId}`);
                  }}
                  onRename={(id, newName) => {
                    alert(`Renamed ${id} to ${newName}`);
                  }}
                  onDelete={(id) => {
                    alert(`Delete requested for node: ${id}`);
                  }}
                />
              </Card>
            </section>
          </div>

          {/* Step Progress */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Sliders size={16} className="text-accent" />
              Wizard Step Progress
            </h3>
            <Card className="p-6">
              <StepProgress
                steps={[
                  { id: "1", title: "Industry" },
                  { id: "2", title: "Company Profile" },
                  { id: "3", title: "Teams & Units" },
                  { id: "4", title: "Roles" },
                  { id: "5", title: "Invite Members" },
                  { id: "6", title: "Import Data" },
                ]}
                currentStepIndex={stepIndex}
                onStepClick={setStepIndex}
              />
              <div className="flex justify-end gap-2 mt-8 pt-4 border-t border-border-subtle">
                <Button variant="outline" size="sm" onClick={() => setStepIndex((s) => Math.max(0, s - 1))}>
                  Previous
                </Button>
                <Button variant="accent" size="sm" onClick={() => setStepIndex((s) => Math.min(5, s + 1))}>
                  Next Step
                </Button>
              </div>
            </Card>
          </section>

          {/* Data Table */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <TableIcon size={16} className="text-accent" />
              DataTable (Searchable, Sortable, Paginated)
            </h3>
            <DataTable data={tableData} columns={tableColumns} searchKey="name" searchPlaceholder="Filter team members..." />
          </section>

          {/* Permission Picker */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Lock size={16} className="text-accent" />
              Permission Picker (Matrix)
            </h3>
            <PermissionPicker
              groups={permissionGroups}
              selectedPermissions={selectedPerms}
              onChange={setSelectedPerms}
            />
          </section>
        </TabsContent>

        {/* ===================== TAB 2: UI PRIMITIVES ===================== */}
        <TabsContent value="primitives" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Textarea & Inputs</CardTitle>
                <CardDescription>Standard input controls with error and disabled states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Company Bio</label>
                  <Textarea placeholder="Enter brief overview of company activities..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Validation Error Textarea</label>
                  <Textarea error defaultValue="Invalid text input" />
                  <span className="text-[11px] text-danger">Exceeds allowed character length</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Toggles, Checkboxes & Avatars</CardTitle>
                <CardDescription>Boolean toggles and user profile representations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-text-primary">Enforce Multi-Factor Auth (MFA)</span>
                    <p className="text-[11px] text-text-secondary">Require all admins to verify 6-digit TOTP</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" defaultChecked />
                  <label htmlFor="terms" className="text-xs text-text-secondary">
                    Enable strict append-only audit trail logging
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Avatar>
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>DM</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== TAB 3: OVERLAYS & MODALS ===================== */}
        <TabsContent value="overlays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Modals, Sheets, and Dialogs</CardTitle>
              <CardDescription>Radix-powered accessible overlays and drawers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {/* Standard Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Modal Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Organization Unit</DialogTitle>
                    <DialogDescription>
                      Update company legal name and primary registration number.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <Input placeholder="Legal name..." defaultValue="Acme Industrial Global Inc." />
                    <Input placeholder="Tax Registration Number..." defaultValue="GSTIN-29AAACA1234F1Z5" />
                  </div>
                  <DialogFooter>
                    <Button variant="accent">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Slide-out Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary">Open Slide-out Panel (Sheet)</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Team Member Details</SheetTitle>
                    <SheetDescription>Inspect user permissions and assigned teams</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-lg bg-surface-2 space-y-2">
                      <p className="text-xs font-semibold text-text-primary">Alex Vhanghar</p>
                      <p className="text-xs text-text-secondary">alex@acme.com</p>
                      <Badge variant="accent">Primary Tenant Owner</Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-text-secondary">Subtree Scope</span>
                      <p className="text-xs text-text-tertiary">root.operations.engineering.*</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Confirm Dialog Trigger */}
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                Trigger Confirm Dialog
              </Button>
              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Revoke Tenant Member"
                description="Are you sure you want to revoke this user's workspace membership? They will immediately lose access to all ERP resources."
                destructive
                confirmLabel="Revoke Access"
                onConfirm={() => {
                  setConfirmOpen(false);
                  alert("Membership revoked safely.");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== TAB 4: 4 STATES GALLERY ===================== */}
        <TabsContent value="states" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Normal State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-mono text-emerald-500">1. Normal State</CardTitle>
                <CardDescription>Component fully rendered with clean data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert variant="default">
                  <AlertTitle>All Systems Healthy</AlertTitle>
                  <AlertDescription>PostgreSQL RLS policies enforced and fail-closed.</AlertDescription>
                </Alert>
                <Button variant="accent" className="w-full">
                  Primary Action
                </Button>
              </CardContent>
            </Card>

            {/* 2. Loading State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-mono text-accent">2. Loading State</CardTitle>
                <CardDescription>Skeleton and spinner placeholders during async fetch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
                <Button variant="outline" className="w-full" isLoading>
                  Submitting Payload...
                </Button>
              </CardContent>
            </Card>

            {/* 3. Empty State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-mono text-amber-500">3. Empty State</CardTitle>
                <CardDescription>Zero-data guidance when no entities exist</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="No Invoices Recorded"
                  description="You haven't generated or received any invoices in this fiscal quarter yet."
                  actionLabel="Create Invoice"
                  onAction={() => alert("New invoice modal")}
                />
              </CardContent>
            </Card>

            {/* 4. Error State */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-mono text-danger">4. Error State</CardTitle>
                <CardDescription>Actionable failure feedback and recovery affordance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Cross-Tenant Boundary Violation</AlertTitle>
                  <AlertDescription>
                    Your current transaction attempted an insert with an unauthorized tenant_id. Action blocked by RLS.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" className="w-full text-danger border-danger/30 hover:bg-danger-soft">
                  Retry Operation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
