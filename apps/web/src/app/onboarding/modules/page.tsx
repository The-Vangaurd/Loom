"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Package, Receipt, ShoppingCart, Users, Wallet, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  isCore: boolean;
}

const availableModules: ModuleConfig[] = [
  { id: "inventory", name: "Inventory & Warehouse", description: "Multi-location inventory, lot tracking, and automated reorder points.", icon: Package, isCore: true },
  { id: "invoicing", name: "Sales & Invoicing", description: "GST/VAT compliant invoices, quotation generation, and payment matching.", icon: Receipt, isCore: true },
  { id: "procurement", name: "Procurement & Sourcing", description: "Purchase requisitions, vendor RFQs, and automated 3-way matching.", icon: ShoppingCart, isCore: true },
  { id: "hr", name: "Human Resources", description: "Employee directory, attendance tracking, and leave management.", icon: Users, isCore: false },
  { id: "payroll", name: "Payroll & Compensation", description: "Automated salary runs, tax deductions, and direct deposit slips.", icon: Wallet, isCore: false },
  { id: "assets", name: "Fixed Assets Management", description: "Asset depreciation schedules, maintenance logs, and lifecycle tracking.", icon: Landmark, isCore: false },
];

export default function ModulesStepPage() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    inventory: true,
    invoicing: true,
    procurement: true,
    hr: true,
    payroll: false,
    assets: false,
  });

  const toggleModule = (id: string, isCore: boolean) => {
    if (isCore) return; // Core modules cannot be disabled
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Enable Operational Modules</h2>
        <p className="text-sm text-text-secondary mt-1">
          Activate the functional subsystems you need today. You can enable additional modules later in Settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableModules.map((mod) => {
          const Icon = mod.icon;
          const isChecked = enabled[mod.id] || mod.isCore;

          return (
            <Card key={mod.id} className="p-4 border-border-subtle bg-surface-1">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-surface-2 text-text-primary border border-border-subtle shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-text-primary">{mod.name}</span>
                      {mod.isCore && <Badge variant="secondary">Core</Badge>}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{mod.description}</p>
                  </div>
                </div>
                <Switch
                  checked={isChecked}
                  disabled={mod.isCore}
                  onCheckedChange={() => toggleModule(mod.id, mod.isCore)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border-subtle">
        <Button variant="outline" onClick={() => router.push("/onboarding/company")}>
          <ArrowLeft size={15} className="mr-2" />
          Back
        </Button>
        <Button variant="accent" onClick={() => router.push("/onboarding/teams")}>
          Continue to Teams
          <ArrowRight size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
