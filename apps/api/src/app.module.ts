import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health/health.controller.js';
import { AuthController } from './auth/auth.controller.js';
import { TenantsController } from './tenants/tenants.controller.js';
import { TenantsService } from './tenants/tenants.service.js';
import { OrgUnitsController } from './org-units/org-units.controller.js';
import { OrgUnitsService } from './org-units/org-units.service.js';
import { ProvisioningService } from './provisioning/provisioning.service.js';
import { TenantInterceptor } from './tenant.interceptor.js';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [
    AppController,
    HealthController,
    AuthController,
    TenantsController,
    OrgUnitsController,
  ],
  providers: [
    AppService,
    ProvisioningService,
    TenantsService,
    OrgUnitsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
