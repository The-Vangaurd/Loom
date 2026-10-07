export interface MockAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: "Success" | "Blocked (RLS)";
}

export const mockAuditLogs: MockAuditEntry[] = [
  { id: "aud-1", timestamp: "2026-10-05 14:32:10", actor: "alex@acme.com", action: "tenant.create", resource: "tenants/tenant-acme", ipAddress: "192.168.1.42", status: "Success" },
  { id: "aud-2", timestamp: "2026-10-05 14:32:11", actor: "alex@acme.com", action: "team.create_root", resource: "org_units/corp-root", ipAddress: "192.168.1.42", status: "Success" },
  { id: "aud-3", timestamp: "2026-10-05 14:35:04", actor: "system.migrator", action: "schema.migrate", resource: "database/0001_rls_setup", ipAddress: "127.0.0.1", status: "Success" },
  { id: "aud-4", timestamp: "2026-10-05 14:40:19", actor: "sarah@acme.com", action: "member.invite", resource: "users/marcus@acme.com", ipAddress: "172.16.0.8", status: "Success" },
  { id: "aud-5", timestamp: "2026-10-05 14:44:34", actor: "test.app_role", action: "cross_tenant.read", resource: "tenants/other_tenant", ipAddress: "127.0.0.1", status: "Blocked (RLS)" },
];
