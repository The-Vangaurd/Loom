export interface IndustryOption {
  id: string;
  name: string;
  description: string;
  defaultModules: string[];
  recommended: boolean;
}

export const mockIndustries: IndustryOption[] = [
  {
    id: "manufacturing",
    name: "Manufacturing & Production",
    description: "Discrete and process manufacturing with BOM, inventory lots, and shop floor tracking.",
    defaultModules: ["inventory", "invoicing", "procurement", "assets"],
    recommended: true,
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    description: "Fleet tracking, multi-warehouse routing, shipment customs, and freight manifest billing.",
    defaultModules: ["inventory", "invoicing", "procurement"],
    recommended: false,
  },
  {
    id: "saas",
    name: "Technology & Software",
    description: "Subscription recurring billing, license seat management, and multi-currency revenue.",
    defaultModules: ["invoicing", "hr", "payroll"],
    recommended: false,
  },
  {
    id: "retail",
    name: "Retail & Multi-Store Commerce",
    description: "Point-of-sale integration, catalog synchronization, barcode scanning, and supplier POs.",
    defaultModules: ["inventory", "invoicing", "procurement"],
    recommended: false,
  },
];
