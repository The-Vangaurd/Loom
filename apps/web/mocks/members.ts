export interface MockMember {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: "Active" | "Pending" | "Suspended";
  avatarUrl?: string;
  joinedAt: string;
}

export const mockMembers: MockMember[] = [
  {
    id: "mem-1",
    name: "Alex Vhanghar",
    email: "alex@acme.com",
    role: "Owner",
    team: "Acme Industrial Corp",
    status: "Active",
    joinedAt: "2026-01-15",
  },
  {
    id: "mem-2",
    name: "Sarah Chen",
    email: "sarah@acme.com",
    role: "Admin",
    team: "Operations & Supply",
    status: "Active",
    joinedAt: "2026-02-01",
  },
  {
    id: "mem-3",
    name: "David Miller",
    email: "david@acme.com",
    role: "Finance Manager",
    team: "Finance & Legal",
    status: "Active",
    joinedAt: "2026-02-12",
  },
  {
    id: "mem-4",
    name: "Elena Rostova",
    email: "elena@acme.com",
    role: "Operations Lead",
    team: "Central Warehouse",
    status: "Active",
    joinedAt: "2026-03-04",
  },
  {
    id: "mem-5",
    name: "Marcus Aurelius",
    email: "marcus@acme.com",
    role: "Member",
    team: "Procurement & Sourcing",
    status: "Pending",
    joinedAt: "2026-03-28",
  },
];
