export * from "./auth.schema";
export * from "./org-unit.schema";
export * from "./tenant.schema";

// Core DTOs and Shared Constants
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
}
