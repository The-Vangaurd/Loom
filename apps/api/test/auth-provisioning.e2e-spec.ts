import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module.js";
import { INestApplication } from "@nestjs/common";
import { startProvisioningWorker } from "../src/provisioning/provisioning.processor.js";
import pg from "pg";
import { v4 as uuid } from "uuid";

describe("Phase 7: Real Authentication & Tenant Provisioning (e2e)", () => {
  let app: INestApplication;
  let pgClient: pg.Client;
  let worker: any;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    await app.init();

    worker = startProvisioningWorker();

    pgClient = new pg.Client({
      connectionString: "postgres://migrator:migrator_pass@localhost:5432/loom_erp",
    });
    await pgClient.connect();
  });

  afterAll(async () => {
    await worker.close();
    await pgClient.end();
    await app.close();
  });

  const testEmail = `user-${uuid().slice(0, 8)}@nexus.com`;
  const companyName = `Nexus Industries ${uuid().slice(0, 4)}`;

  it("should fail validation if required fields are missing", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tenants/register")
      .send({
        email: testEmail,
        companyName: "Nexus",
      });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
  });

  it("should register a new tenant and enqueue provisioning successfully", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/tenants/register")
      .send({
        companyName,
        fullName: "Sarah Connor",
        email: testEmail,
        password: "MasterPassword123!",
        acceptTerms: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tenantId).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);

    const tenantId = res.body.data.tenantId;

    // Wait for the BullMQ worker to process the job
    let attempts = 0;
    let provisioned = false;
    while (attempts < 20 && !provisioned) {
      await new Promise((r) => setTimeout(r, 250));
      const tenantRes = await pgClient.query("SELECT * FROM tenants WHERE id = $1", [tenantId]);
      if (tenantRes.rows.length > 0) {
        provisioned = true;
      }
      attempts++;
    }

    expect(provisioned).toBe(true);

    // Verify root org unit
    const orgRes = await pgClient.query("SELECT * FROM org_units WHERE tenant_id = $1", [tenantId]);
    expect(orgRes.rows.length).toBeGreaterThanOrEqual(1);
    expect(orgRes.rows[0].path).toBe("root");

    // Verify Owner role
    const roleRes = await pgClient.query("SELECT * FROM roles WHERE tenant_id = $1 AND name = $2", [tenantId, "Owner"]);
    expect(roleRes.rows.length).toBe(1);

    // Verify membership
    const memRes = await pgClient.query("SELECT * FROM memberships WHERE tenant_id = $1", [tenantId]);
    expect(memRes.rows.length).toBe(1);
  });

  it("should authenticate the registered user via Better Auth and return session", async () => {
    const loginRes = await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({
        email: testEmail,
        password: "MasterPassword123!",
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.email).toBe(testEmail);

    // Extract cookie
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // Verify session retrieval using session cookie
    const sessionRes = await request(app.getHttpServer())
      .get("/api/auth/get-session")
      .set("Cookie", cookies);

    expect(sessionRes.status).toBe(200);
    expect(sessionRes.body.user.email).toBe(testEmail);
    expect(sessionRes.body.session.token).toBe(loginRes.body.token);
  });
});
