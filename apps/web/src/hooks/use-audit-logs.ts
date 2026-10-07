import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MockAuditEntry } from "@/../mocks/audit-logs";

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => apiClient<MockAuditEntry[]>("/audit-logs"),
  });
}
