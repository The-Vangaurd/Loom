import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import {
  signupSchema,
  updateCompanyProfileSchema,
  updateModulesSchema,
} from "@loom/shared";
import { auth } from "../auth.js";
import { ProvisioningService } from "../provisioning/provisioning.service.js";
import { TenantsService } from "./tenants.service.js";
import { v4 as uuid } from "uuid";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq } from "drizzle-orm";

@Controller("api/tenants")
export class TenantsController {
  constructor(
    @Inject(ProvisioningService)
    private readonly provisioningService: ProvisioningService,
    @Inject(TenantsService)
    private readonly tenantsService: TenantsService,
  ) {}

  @Get("current")
  async getCurrent() {
    const data = await this.tenantsService.getCurrentTenant();
    return { success: true, data };
  }

  @Patch("current")
  async updateCurrent(@Body() body: any) {
    const parsed = updateCompanyProfileSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid company profile payload",
        fields: parsed.error.flatten().fieldErrors,
      });
    }
    const data = await this.tenantsService.updateCurrentTenant(parsed.data);
    return { success: true, data };
  }

  @Get("modules")
  async getModules() {
    const data = await this.tenantsService.getModules();
    return { success: true, data };
  }

  @Patch("modules")
  async updateModules(@Body() body: any) {
    const parsed = updateModulesSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid modules payload",
        fields: parsed.error.flatten().fieldErrors,
      });
    }
    const data = await this.tenantsService.updateModules(parsed.data);
    return { success: true, data };
  }

  @Post("register")
  async register(@Body() body: any) {
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid registration parameters",
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    const { companyName, fullName, email, password } = parsed.data;

    let userObj: { id: string; email: string; name?: string };

    try {
      // 1. Create global user via Better Auth
      const user = await auth.api.signUpEmail({
        body: {
          name: fullName,
          email,
          password,
        },
      });

      if (!user || !user.user) {
        throw new BadRequestException({
          code: "SIGNUP_FAILED",
          message: "Failed to create user identity",
        });
      }
      userObj = user.user;
    } catch (err: any) {
      // Handle case where user already exists (test ID or re-registration during dev testing)
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        userObj = existingUser[0];
      } else {
        throw new BadRequestException({
          code: "SIGNUP_FAILED",
          message: err?.message || "Failed to create user identity",
        });
      }
    }

    // Check if this user already has an existing tenant linked
    const existingTenantUser = await db
      .select({ tenantId: schema.tenantUsers.tenantId })
      .from(schema.tenantUsers)
      .where(eq(schema.tenantUsers.userId, userObj.id))
      .limit(1);

    let tenantId: string;
    if (existingTenantUser.length > 0) {
      tenantId = existingTenantUser[0].tenantId;
    } else {
      // 2. Generate workspace tenant identifier and slug
      tenantId = uuid();
      const slug = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${uuid().slice(0, 6)}`;

      // 3. Enqueue background provisioning job in BullMQ
      await this.provisioningService.enqueueProvisioning({
        tenantId,
        companyName,
        slug,
        userId: userObj.id,
        userEmail: email,
      });
    }

    return {
      success: true,
      data: {
        tenantId,
        companyName,
        user: {
          id: userObj.id,
          email: userObj.email,
        },
      },
    };
  }
}
