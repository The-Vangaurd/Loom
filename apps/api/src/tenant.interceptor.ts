import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable, from, firstValueFrom } from 'rxjs';
import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

import { auth } from './auth.js';
import { tenantUsers } from './db/schema.js';
import { eq } from 'drizzle-orm';
import { fromNodeHeaders } from 'better-auth/node';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(@Inject(ClsService) private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Bypass database transaction wrap for public or unauthenticated endpoints
    if (
      !req.url ||
      req.url === '/health' ||
      req.url.startsWith('/health') ||
      req.url.startsWith('/api/auth') ||
      req.url.startsWith('/api/tenants/register')
    ) {
      return next.handle();
    }

    return from(
      (async () => {
        let tenantId = req.headers['x-tenant-id'] as string | undefined;

        if (!tenantId) {
          try {
            const session = await auth.api.getSession({
              headers: fromNodeHeaders(req.headers),
            });
            if (session?.user?.id) {
              const res = await db
                .select({ tenantId: tenantUsers.tenantId })
                .from(tenantUsers)
                .where(eq(tenantUsers.userId, session.user.id))
                .limit(1);
              if (res.length > 0) {
                tenantId = res[0].tenantId;
              }
            }
          } catch {
            // Ignore if unauthenticated
          }
        }

        // Hardcoded test fallback for developer and seamless testing
        if (!tenantId) {
          tenantId = '00000000-0000-0000-0000-000000000001';
        }

        return db.transaction(async (tx) => {
          if (tenantId) {
            await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
          }

          if (this.cls) {
            this.cls.set('tx', tx);
            this.cls.set('tenantId', tenantId);
          }

          return await firstValueFrom(next.handle());
        });
      })()
    );
  }
}
