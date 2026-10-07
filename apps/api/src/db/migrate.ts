import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://migrator:migrator_pass@localhost:5432/loom_erp',
  });
  await client.connect();
  const db = drizzle(client);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log("Migrations complete!");
  
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed!", err);
  process.exit(1);
});
