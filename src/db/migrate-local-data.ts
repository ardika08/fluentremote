import "dotenv/config";

import { Client } from "pg";

const DEFAULT_LOCAL_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/fluentremote";

const tablePlan = [
  { name: "user", primaryKeys: ["id"] },
  { name: "verification", primaryKeys: ["id"] },
  { name: "licenses", primaryKeys: ["id"] },
  { name: "user_settings", primaryKeys: ["user_id"] },
  { name: "account", primaryKeys: ["id"] },
  { name: "session", primaryKeys: ["id"] },
  { name: "purchase_orders", primaryKeys: ["id"] },
  { name: "device_installations", primaryKeys: ["id"] },
  { name: "usage_logs", primaryKeys: ["id"] },
] as const;

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function getLocalDatabaseUrl() {
  return process.env.LOCAL_DATABASE_URL ?? DEFAULT_LOCAL_DATABASE_URL;
}

function getTargetDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  return process.env.DATABASE_URL;
}

function shouldUseSsl(connectionString: string) {
  try {
    const { hostname } = new URL(connectionString);
    return (
      hostname.includes("supabase.co") || hostname.includes("supabase.com")
    );
  } catch {
    return false;
  }
}

async function copyTable(
  source: Client,
  target: Client,
  tableName: (typeof tablePlan)[number]["name"],
  primaryKeys: readonly string[],
) {
  const { rows } = await source.query(
    `select * from ${quoteIdentifier(tableName)} order by 1`,
  );

  if (rows.length === 0) {
    console.log(`${tableName}: no rows to migrate`);
    return;
  }

  const columns = Object.keys(rows[0]);
  const columnList = columns.map(quoteIdentifier).join(", ");
  const conflictColumns = primaryKeys.map(quoteIdentifier).join(", ");
  const updatableColumns = columns.filter((column) => !primaryKeys.includes(column));
  const updateClause =
    updatableColumns.length > 0
      ? updatableColumns
          .map(
            (column) =>
              `${quoteIdentifier(column)} = excluded.${quoteIdentifier(column)}`,
          )
          .join(", ")
      : `${quoteIdentifier(primaryKeys[0])} = excluded.${quoteIdentifier(
          primaryKeys[0],
        )}`;

  for (const row of rows) {
    const values = columns.map((column) => row[column]);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    await target.query(
      `
        insert into ${quoteIdentifier(tableName)} (${columnList})
        values (${placeholders})
        on conflict (${conflictColumns}) do update
        set ${updateClause}
      `,
      values,
    );
  }

  console.log(`${tableName}: migrated ${rows.length} row(s)`);
}

async function main() {
  const source = new Client({
    connectionString: getLocalDatabaseUrl(),
    ssl: false,
  });
  const targetConnectionString = getTargetDatabaseUrl();
  const target = new Client({
    connectionString: targetConnectionString,
    ssl: shouldUseSsl(targetConnectionString)
      ? { rejectUnauthorized: false }
      : false,
  });

  await source.connect();
  await target.connect();

  try {
    for (const table of tablePlan) {
      await copyTable(source, target, table.name, table.primaryKeys);
    }
  } finally {
    await source.end();
    await target.end();
  }
}

main().catch((error) => {
  console.error("Local-to-Supabase data migration failed.");
  console.error(error);
  process.exit(1);
});
