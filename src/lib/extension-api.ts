import { createHash } from "node:crypto";

import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { licenses, userSettings } from "@/db/schema";
import { decryptSecret } from "@/lib/secrets";
import { translateText } from "@/lib/translate";
import type { AIProvider, TranslationMode, TranslationResponse } from "@/types/domain";

function normalizeLicenseKey(code: string) {
  return code.trim().toUpperCase();
}

function hashLicenseKey(code: string) {
  return createHash("sha256").update(normalizeLicenseKey(code)).digest("hex");
}

async function findLicenseOwnerWorkspace(licenseKey: string) {
  const normalized = normalizeLicenseKey(licenseKey);
  if (!normalized) {
    throw new Error("LICENSE_REQUIRED");
  }

  const db = getDb();
  const license = await db.query.licenses.findFirst({
    where: eq(licenses.activationCodeHash, hashLicenseKey(normalized)),
  });

  if (!license) {
    throw new Error("LICENSE_INVALID");
  }

  if (license.status === "revoked") {
    throw new Error("LICENSE_REVOKED");
  }

  if (!license.issuedToUserId) {
    throw new Error("LICENSE_UNASSIGNED");
  }

  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, license.issuedToUserId),
    with: {
      license: true,
    },
  });

  if (!settings?.entitledAt || !settings.licenseId) {
    throw new Error("PURCHASE_REQUIRED");
  }

  return {
    license,
    settings,
  };
}

/**
 * Returns CORS headers for extension API routes.
 *
 * In production, only the extension's chrome-extension:// origin is allowed.
 * In development, localhost is also permitted.
 *
 * MAYAR_WEBHOOK_SECRET is used for HMAC verification — not CORS.
 */
export function getExtensionCorsHeaders(): Record<string, string> {
  const allowedOrigins = getAllowedExtensionOrigins();

  return {
    // Restrict to known extension origin(s) — not wildcard "*"
    "Access-Control-Allow-Origin": allowedOrigins,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

/**
 * Builds the allowed origin string from environment config.
 *
 * Set EXTENSION_CHROME_ID in production to your extension's Chrome ID.
 * Example: EXTENSION_CHROME_ID=abcdefghijklmnopqrstuvwxyz012345
 *
 * In development (NODE_ENV !== production) localhost is also allowed.
 */
function getAllowedExtensionOrigins(): string {
  const chromeExtId = process.env.EXTENSION_CHROME_ID;

  // In development, allow localhost as well
  if (process.env.NODE_ENV !== "production") {
    if (chromeExtId) {
      return `chrome-extension://${chromeExtId}`;
    }
    return "http://localhost:3000";
  }

  // Production: require the Chrome extension ID to be set
  if (!chromeExtId) {
    throw new Error(
      "EXTENSION_CHROME_ID must be set in production to restrict CORS to the extension origin.",
    );
  }

  return `chrome-extension://${chromeExtId}`;
}

export async function getExtensionConfig(licenseKey: string) {
  const { license, settings } = await findLicenseOwnerWorkspace(licenseKey);
  const hasOpenAIApiKey = Boolean(settings.openaiApiKeyEncrypted);
  const hasMaiaRouterApiKey = Boolean(settings.maiaRouterApiKeyEncrypted);

  return {
    ok: true,
    licenseStatus: license.status === "revoked" ? "revoked" : "active",
    licenseKeyMasked: license.activationCodeMasked,
    sourceLanguage: settings.sourceLanguage,
    targetLanguage: settings.targetLanguage,
    aiProvider: settings.aiProvider,
    hasOpenAIApiKey,
    hasMaiaRouterApiKey,
    hasProviderKeys: hasOpenAIApiKey || hasMaiaRouterApiKey,
    syncedAt: new Date().toISOString(),
  };
}

export async function updateExtensionPreferences(params: {
  licenseKey: string;
  sourceLanguage: string;
  targetLanguage: string;
}) {
  const { license, settings } = await findLicenseOwnerWorkspace(params.licenseKey);
  const db = getDb();

  await db
    .update(userSettings)
    .set({
      sourceLanguage: params.sourceLanguage,
      targetLanguage: params.targetLanguage,
    })
    .where(eq(userSettings.userId, license.issuedToUserId!));

  return {
    ok: true,
    sourceLanguage: params.sourceLanguage,
    targetLanguage: params.targetLanguage,
    aiProvider: settings.aiProvider,
  };
}

export async function translateForExtension(params: {
  licenseKey: string;
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  aiProvider?: AIProvider;
  mode?: TranslationMode;
}): Promise<TranslationResponse> {
  const { settings } = await findLicenseOwnerWorkspace(params.licenseKey);

  const sourceLanguage = params.sourceLanguage ?? settings.sourceLanguage ?? "Indonesian";
  const targetLanguage = params.targetLanguage ?? settings.targetLanguage ?? "English";
  const aiProvider = params.aiProvider ?? settings.aiProvider ?? "openai";
  const mode = params.mode ?? "read";

  let apiKey: string;

  if (aiProvider === "openai") {
    if (!settings.openaiApiKeyEncrypted) throw new Error("OPENAI_KEY_REQUIRED");
    apiKey = decryptSecret(settings.openaiApiKeyEncrypted);
  } else {
    if (!settings.maiaRouterApiKeyEncrypted) throw new Error("MAIA_ROUTER_KEY_REQUIRED");
    apiKey = decryptSecret(settings.maiaRouterApiKeyEncrypted);
  }

  return translateText({
    text: params.text,
    sourceLanguage,
    targetLanguage,
    provider: aiProvider,
    apiKey,
    mode,
  });
}
