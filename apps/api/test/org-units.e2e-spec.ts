import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module.js";
import { INestApplication } from "@nestjs/common";
import { startProvisioningWorker } from "../src/provisioning/provisioning.processor.js";
import pg from "pg";
import { v4 as uuid } from "uuid";

describe("Phase 8: Company, Teams (ltree), and Modules (e2e)", () => {
  let app: INestApplication;
  let pgClient: pg.Client;
  let worker: any;

  let tenantAId: string;
  let tenantBId: string;
  let rootUnitId: string;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    await app.init();

    worker = startProvisioningWorker();

    pgClient = new pg.Client({
      connectionString: "postgres://migrator:migrator_pass@localhost:5432/loom_erp",
    });
    await pgClient.connect();

    // Register Tenant A
    const regA = await request(app.getHttpServer())
      .post("/api/tenants/register")
      .send({
        companyName: `Acme Corp ${uuid().slice(0, 4)}`,
        fullName: "Arthur Dent",
        email: `arthur-${uuid().slice(0, 6)}@acme.com`,
        password: "MasterPassword123!",
        acceptTerms: true,
      });

    tenantAId = regA.body.data.tenantId;

    // Register Tenant B (for cross-tenant boundary verification)
    const regB = await request(app.getHttpServer())
      .post("/api/tenants/register")
      .send({
        companyName: `Sirius Cybernetics ${uuid().slice(0, 4)}`,
        fullName: "Ford Prefect",
        email: `ford-${uuid().slice(0, 6)}@sirius.com`,
        password: "MasterPassword123!",
        acceptTerms: true,
      });

    tenantBId = regB.body.data.tenantId;

    // Wait for provisioning worker to finish
    let attempts = 0;
    while (attempts < 20) {
      await new Promise((r) => setTimeout(r, 200));
      const res = await pgClient.query("SELECT * FROM org_units WHERE tenant_id = $1", [tenantAId]);
      if (res.rows.length > 0) {
        rootUnitId = res.rows[0].id;
        break;
      }
      attempts++;
    }
  });

  afterAll(async () => {
    await worker.close();
    await pgClient.end();
    await app.close();
  });

  describe("Company Profile & Modules API", () => {
    it("should get current tenant profile with default configuration", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/tenants/current")
        .set("x-tenant-id", tenantAId);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(tenantAId);
      expect(res.body.data.currency).toBe("USD");
      expect(res.body.data.modules.inventory).toBe(true);
    });

    it("should update company legal profile", async () => {
      const res = await request(app.getHttpServer())
        .patch("/api/tenants/current")
        .set("x-tenant-id", tenantAId)
        .send({
          name: "Acme Megacorp",
          taxId: "TAX-GB-998877",
          currency: "EUR",
          timezone: "Europe/London",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Acme Megacorp");
      expect(res.body.data.taxId).toBe("TAX-GB-998877");
      expect(res.body.data.currency).toBe("EUR");
      expect(res.body.data.timezone).toBe("Europe/London");
    });

    it("should toggle business modules", async () => {
      const res = await request(app.getHttpServer())
        .patch("/api/tenants/modules")
        .set("x-tenant-id", tenantAId)
        .send({
          modules: {
            inventory: true,
            invoicing: true,
            procurement: true,
            hr: true,
            payroll: true,
            assets: true,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.data.payroll).toBe(true);
      expect(res.body.data.assets).toBe(true);
    });
  });

  describe("Org Units & PostgreSQL ltree Hierarchies", () => {
    let engineeringId: string;
    let infraId: string;
    let operationsId: string;

    it("should retrieve initial tree containing root unit", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/org-units")
        .set("x-tenant-id", tenantAId);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].id).toBe(rootUnitId);
      expect(res.body.data[0].path).toBe("root");
    });

    it("should create department under root unit", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/org-units")
        .set("x-tenant-id", tenantAId)
        .send({
          name: "Engineering",
          parentId: rootUnitId,
        });

      expect(res.status).toBe(201);
      engineeringId = res.body.data.id;
      expect(res.body.data.name).toBe("Engineering");
      expect(res.body.data.path).toMatch(/^root\.engineering_[a-z0-9]+$/);
    });

    it("should create sub-team under Engineering", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/org-units")
        .set("x-tenant-id", tenantAId)
        .send({
          name: "Core Infrastructure",
          parentId: engineeringId,
        });

      expect(res.status).toBe(201);
      infraId = res.body.data.id;
      expect(res.body.data.name).toBe("Core Infrastructure");
      expect(res.body.data.path).toMatch(/^root\.engineering_[a-z0-9]+\.core_infrastructure_[a-z0-9]+$/);
    });

    it("should create another department 'Operations'", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/org-units")
        .set("x-tenant-id", tenantAId)
        .send({
          name: "Operations",
          parentId: rootUnitId,
        });

      expect(res.status).toBe(201);
      operationsId = res.body.data.id;
      expect(res.body.data.path).toMatch(/^root\.operations_[a-z0-9]+$/);
    });

    it("should move 'Core Infrastructure' from 'Engineering' to 'Operations' via ltree update", async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/org-units/${infraId}/move`)
        .set("x-tenant-id", tenantAId)
        .send({
          newParentId: operationsId,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.success).toBe(true);
      expect(res.body.data.newPath).toMatch(/^root\.operations_[a-z0-9]+\.core_infrastructure_[a-z0-9]+$/);

      // Verify hierarchical tree response
      const treeRes = await request(app.getHttpServer())
        .get("/api/org-units")
        .set("x-tenant-id", tenantAId);

      const root = treeRes.body.data[0];
      const opsInTree = root.children.find((c: any) => c.id === operationsId);
      expect(opsInTree).toBeDefined();
      expect(opsInTree.children.some((sub: any) => sub.id === infraId)).toBe(true);

      const engInTree = root.children.find((c: any) => c.id === engineeringId);
      expect(engInTree.children.length).toBe(0);
    });

    it("should prevent circular moves (cannot move node into its own descendant)", async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/org-units/${operationsId}/move`)
        .set("x-tenant-id", tenantAId)
        .send({
          newParentId: infraId,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/descendant/i);
    });

    it("should enforce multi-tenant isolation across org units", async () => {
      // Tenant B requests its org units
      const resB = await request(app.getHttpServer())
        .get("/api/org-units")
        .set("x-tenant-id", tenantBId);

      expect(resB.status).toBe(200);
      // Tenant B should only see its own root, NOT Engineering, Operations, or Infrastructure
      const allBIds = JSON.stringify(resB.body.data);
      expect(allBIds).not.toContain(engineeringId);
      expect(allBIds).not.toContain(operationsId);
      expect(allBIds).not.toContain(infraId);

      // Tenant B attempting to delete Tenant A's unit returns 404
      const deleteAttempt = await request(app.getHttpServer())
        .delete(`/api/org-units/${infraId}`)
        .set("x-tenant-id", tenantBId);

      expect(deleteAttempt.status).toBe(404);
    });

    it("should successfully delete an empty leaf team", async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/org-units/${infraId}`)
        .set("x-tenant-id", tenantAId);

      expect(res.status).toBe(200);
      expect(res.body.data.success).toBe(true);

      // Verify deletion in tree
      const treeRes = await request(app.getHttpServer())
        .get("/api/org-units")
        .set("x-tenant-id", tenantAId);

      const treeStr = JSON.stringify(treeRes.body.data);
      expect(treeStr).not.toContain(infraId);
    });
  });
});
