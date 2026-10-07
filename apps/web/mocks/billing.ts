export interface MockInvoice {
  id: string;
  number: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  downloadUrl: string;
}

export const mockInvoices: MockInvoice[] = [
  { id: "inv-001", number: "INV-2026-001", date: "Mar 01, 2026", amount: "$499.00", status: "Paid", downloadUrl: "#" },
  { id: "inv-002", number: "INV-2026-002", date: "Feb 01, 2026", amount: "$499.00", status: "Paid", downloadUrl: "#" },
  { id: "inv-003", number: "INV-2026-003", date: "Jan 01, 2026", amount: "$499.00", status: "Paid", downloadUrl: "#" },
];

export const mockSubscription = {
  planName: "Enterprise Tier (Trial)",
  status: "active",
  price: "$499 / month",
  renewalDate: "April 15, 2026",
  seatsUsed: 18,
  seatsTotal: 50,
  storageUsedGB: 4.2,
  storageTotalGB: 100,
};
