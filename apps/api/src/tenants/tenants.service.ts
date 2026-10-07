import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { db } from "../db/index.js";
import { tenants } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
  UpdateCompanyProfileInput,
  UpdateModulesInput,
  TenantProfile,
} from "@loom/shared";

@Injectable()
export class TenantsService {
  constructor(@Inject(ClsService) private readonly cls: ClsService) {}

  private getClient() {
    return this.cls.get("tx") || db;
  }

  private getTenantId(): string {
    const tenantId = this.cls.get("tenantId");
    if (!tenantId) {
      throw new NotFoundException("Tenant context not found");
    }
    return tenantId;
  }

  async getCurrentTenant(): Promise<TenantProfile> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    const rows = await client
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (rows.length === 0) {
      throw new NotFoundException("Tenant not found");
    }

    const t = rows[0];
    return {
      id: t.id,
      name: t.name,
      slug: t.slug,
      taxId: t.taxId ?? null,
      currency: t.currency ?? "USD",
      timezone: t.timezone ?? "UTC",
      logoUrl: t.logoUrl ?? null,
      modules: (t.modules as Record<string, boolean>) ?? {
        inventory: true,
        invoicing: true,
        procurement: true,
        hr: true,
        payroll: false,
        assets: false,
      },
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }

  async updateCurrentTenant(data: UpdateCompanyProfileInput): Promise<TenantProfile> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.taxId !== undefined) updatePayload.taxId = data.taxId;
    if (data.currency !== undefined) updatePayload.currency = data.currency;
    if (data.timezone !== undefined) updatePayload.timezone = data.timezone;
    if (data.logoUrl !== undefined) updatePayload.logoUrl = data.logoUrl;

    await client
      .update(tenants)
      .set(updatePayload)
      .where(eq(tenants.id, tenantId));

    return this.getCurrentTenant();
  }

  async getModules(): Promise<Record<string, boolean>> {
    const tenant = await this.getCurrentTenant();
    return tenant.modules;
  }

  async updateModules(data: UpdateModulesInput): Promise<Record<string, boolean>> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    await client
      .update(tenants)
      .set({
        modules: data.modules,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId));

    const tenant = await this.getCurrentTenant();
    return tenant.modules;
  }
}
