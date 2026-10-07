import { TreeNode } from "@/components/erp/tree-view";

export const initialMockTeams: TreeNode[] = [
  {
    id: "corp-root",
    name: "Acme Industrial Corp",
    type: "unit",
    count: 48,
    children: [
      {
        id: "team-ops",
        name: "Operations & Supply",
        type: "team",
        count: 24,
        children: [
          { id: "team-warehouse", name: "Central Warehouse", type: "team", count: 14 },
          { id: "team-procure", name: "Procurement & Sourcing", type: "team", count: 10 },
        ],
      },
      {
        id: "team-finance",
        name: "Finance & Legal",
        type: "team",
        count: 8,
        children: [
          { id: "team-tax", name: "Tax & Compliance", type: "team", count: 3 },
          { id: "team-ar-ap", name: "Accounts Payable / Receivable", type: "team", count: 5 },
        ],
      },
      {
        id: "team-engineering",
        name: "Engineering & Maintenance",
        type: "team",
        count: 16,
      },
    ],
  },
];
