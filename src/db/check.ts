import "dotenv/config";

import { sql } from "drizzle-orm";

import { getDb, getDatabaseUrl } from "@/db";

async function main() {
  const db = getDb();
  const result = await db.execute(sql`select current_database(), now()`);

  console.log("Database connection OK");
  console.log(`URL: ${getDatabaseUrl()}`);
  console.log(JSON.stringify(result.rows[0] ?? {}, null, 2));
}

main().catch((error) => {
  console.error("Database connection failed");
  console.error(error);
  process.exit(1);
});
