import { Injectable, OnModuleInit } from '@nestjs/common';
import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { auth } from './auth.js';

@Injectable()
export class AppService implements OnModuleInit {
  async onModuleInit() {
    await this.ensureTestUserAndTenant();
  }

  async ensureTestUserAndTenant() {
    try {
      // 1. Check or seed test user
      const testUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, 'test@loom.com'))
        .limit(1);

      let userId: string;
      if (testUser.length === 0) {
        const created = await auth.api.signUpEmail({
          body: {
            name: 'Test User',
            email: 'test@loom.com',
            password: 'password123',
          },
        });
        userId = created.user.id;
      } else {
        userId = testUser[0].id;
      }

      // 2. Check or seed test tenant
      const testTenantId = '00000000-0000-0000-0000-000000000001';
      try {
        await db.execute(
          sql`SELECT create_tenant(${testTenantId}::text, 'Loom Test Workspace'::text, 'loom-test-workspace'::text, ${userId}::text)`
        );
      } catch {
        // Already exists, ignore
      }

      // Ensure tenant_users links user to test tenant
      try {
        await db.execute(
          sql`INSERT INTO tenant_users (id, tenant_id, user_id, role) VALUES (gen_random_uuid()::text, ${testTenantId}, ${userId}, 'admin') ON CONFLICT DO NOTHING`
        );
      } catch {
        // Already linked, ignore
      }

      console.log(`[AppService] Test User (test@loom.com / password123) and Tenant (${testTenantId}) ready`);
    } catch (err: any) {
      console.warn('[AppService] Could not seed test user/tenant:', err?.message);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
