import { Controller, Get } from "@nestjs/common";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import Redis from "ioredis";

@Controller("health")
export class HealthController {
  private redis: Redis | null = null;

  constructor() {
    try {
      this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
      });
    } catch (e) {
      this.redis = null;
    }
  }

  @Get()
  async check() {
    let postgresStatus = "disconnected";
    let redisStatus = "disconnected";

    // 1. Verify PostgreSQL
    try {
      await db.execute(sql`SELECT 1`);
      postgresStatus = "connected";
    } catch (err: any) {
      postgresStatus = `error: ${err.message}`;
    }

    // 2. Verify Redis
    try {
      if (this.redis) {
        if (this.redis.status !== "ready") {
          await this.redis.connect();
        }
        const pong = await this.redis.ping();
        if (pong === "PONG") {
          redisStatus = "connected";
        }
      }
    } catch (err: any) {
      redisStatus = `error: ${err.message}`;
    }

    const isHealthy = postgresStatus === "connected" && redisStatus === "connected";

    return {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        postgres: postgresStatus,
        redis: redisStatus,
      },
    };
  }
}
