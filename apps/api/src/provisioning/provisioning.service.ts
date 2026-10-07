import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { TenantProvisioningJobData } from "./provisioning.types.js";

@Injectable()
export class ProvisioningService {
  private queue: Queue<TenantProvisioningJobData>;

  constructor() {
    this.queue = new Queue("tenant-provisioning", {
      connection: {
        host: "localhost",
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: true,
      },
    });
  }

  async enqueueProvisioning(data: TenantProvisioningJobData) {
    return this.queue.add("provision-workspace", data);
  }
}
