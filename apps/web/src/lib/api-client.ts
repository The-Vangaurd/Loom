import { ApiResponse } from "@loom/shared";
import { mockMembers } from "@/../mocks/members";
import { initialMockTeams } from "@/../mocks/teams";
import { mockSubscription, mockInvoices } from "@/../mocks/billing";
import { mockAuditLogs } from "@/../mocks/audit-logs";
import { mockImportBatches } from "@/../mocks/imports";

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export class ApiException extends Error {
  code: string;
  fields?: Record<string, string>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.code = error.code;
    this.fields = error.fields;
  }
}

// Read configuration flag (default to true in local prototype)
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // If mocks enabled, intercept known endpoints and return mock fixtures with simulated latency
  if (USE_MOCKS) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (endpoint.startsWith("/members")) {
      return mockMembers as unknown as T;
    }
    if (endpoint.startsWith("/teams")) {
      return initialMockTeams as unknown as T;
    }
    if (endpoint.startsWith("/billing/subscription")) {
      return mockSubscription as unknown as T;
    }
    if (endpoint.startsWith("/billing/invoices")) {
      return mockInvoices as unknown as T;
    }
    if (endpoint.startsWith("/audit-logs")) {
      return mockAuditLogs as unknown as T;
    }
    if (endpoint.startsWith("/imports")) {
      return mockImportBatches as unknown as T;
    }
  }

  // Real backend fetch
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new ApiException({
      code: json.error?.code || `HTTP_${response.status}`,
      message: json.error?.message || "An unexpected error occurred",
      fields: json.error?.fields,
    });
  }

  return json.data as T;
}
