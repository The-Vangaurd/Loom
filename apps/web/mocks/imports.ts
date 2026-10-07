export interface MockImportBatch {
  id: string;
  filename: string;
  module: string;
  rowCount: number;
  successCount: number;
  errorCount: number;
  status: "Completed" | "Processing" | "Rolled Back";
  createdAt: string;
}

export const mockImportBatches: MockImportBatch[] = [
  { id: "imp-101", filename: "chart_of_accounts_q1.csv", module: "Invoicing & Ledger", rowCount: 1420, successCount: 1420, errorCount: 0, status: "Completed", createdAt: "2026-10-02" },
  { id: "imp-102", filename: "warehouse_inventory_skus.csv", module: "Inventory", rowCount: 8500, successCount: 8488, errorCount: 12, status: "Completed", createdAt: "2026-10-03" },
  { id: "imp-103", filename: "employee_directory_2026.csv", module: "Human Resources", rowCount: 240, successCount: 240, errorCount: 0, status: "Completed", createdAt: "2026-10-04" },
];
