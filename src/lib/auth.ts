import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { getDb } from "@/db";

const authBaseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret) {
  throw new Error(
    "BETTER_AUTH_SECRET must be set in environment variables. Generate one with: openssl rand -base64 32",
  );
}

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: authBaseUrl,
  secret: authSecret,
  database: drizzleAdapter(getDb(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  trustedOrigins: Array.from(
    new Set([authBaseUrl, "http://localhost:3000", "http://127.0.0.1:3000"]),
  ),
  plugins: [nextCookies()],
});
