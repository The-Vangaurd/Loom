import { z } from "zod";

export const updateCompanyProfileSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100).optional(),
  taxId: z.string().max(50).optional().nullable(),
  currency: z.string().length(3, "Currency code must be 3 characters").optional(),
  timezone: z.string().min(1, "Timezone is required").optional(),
  logoUrl: z.string().url().optional().nullable(),
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;

export const updateModulesSchema = z.object({
  modules: z.record(z.boolean()),
});

export type UpdateModulesInput = z.infer<typeof updateModulesSchema>;

export interface TenantProfile {
  id: string;
  name: string;
  slug: string;
  taxId: string | null;
  currency: string;
  timezone: string;
  logoUrl: string | null;
  modules: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}
