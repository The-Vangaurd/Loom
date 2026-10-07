import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { startProvisioningWorker } from './provisioning/provisioning.processor.js';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enterprise Security Middleware
  app.use(helmet());

  // Strict CORS for cookie & credentials sharing with Next.js frontend
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  });

  // Start BullMQ provisioning background worker
  startProvisioningWorker();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Loom ERP API & Provisioning Worker running on http://localhost:${port}`);
}

await bootstrap();
