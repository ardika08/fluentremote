import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { PoolConfig } from "pg";

import * as schema from "@/db/schema";

// Default is only used when DATABASE_URL env is not set (local dev without DB).
// The app degrades gracefully via isDatabaseConfigured() checks.
const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/fluentremote";
const DEFAULT_DATABASE_SSL = "auto";

declare global {
  var __fluentremotePool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL;
}

function getDatabaseSslMode() {
  return (process.env.DATABASE_SSL ?? DEFAULT_DATABASE_SSL).toLowerCase();
}

function isSupabaseDatabaseUrl(databaseUrl: string) {
  try {
    const { hostname } = new URL(databaseUrl);
    return (
      hostname.includes("supabase.co") || hostname.includes("supabase.com")
    );
  } catch {
    return false;
  }
}

function getDatabaseSslConfig(): PoolConfig["ssl"] {
  const sslMode = getDatabaseSslMode();

  if (sslMode === "disable" || sslMode === "false") {
    return undefined;
  }

  if (sslMode === "require" || sslMode === "true") {
    return { rejectUnauthorized: false };
  }

  if (process.env.NODE_ENV === "production") {
    return { rejectUnauthorized: false };
  }

  if (isSupabaseDatabaseUrl(getDatabaseUrl())) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

export function getPool() {
  if (!global.__fluentremotePool) {
    global.__fluentremotePool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: getDatabaseSslConfig(),
    });
  }

  return global.__fluentremotePool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export type DbClient = ReturnType<typeof getDb>;
