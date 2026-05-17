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

export function getExtensionCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
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
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, settings.userId));

  const refreshed = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, settings.userId),
  });

  return {
    ok: true,
    licenseStatus: license.status === "revoked" ? "revoked" : "active",
    licenseKeyMasked: license.activationCodeMasked,
    sourceLanguage: refreshed?.sourceLanguage ?? params.sourceLanguage,
    targetLanguage: refreshed?.targetLanguage ?? params.targetLanguage,
    aiProvider: refreshed?.aiProvider ?? settings.aiProvider,
    hasOpenAIApiKey: Boolean(refreshed?.openaiApiKeyEncrypted),
    hasMaiaRouterApiKey: Boolean(refreshed?.maiaRouterApiKeyEncrypted),
    hasProviderKeys: Boolean(
      refreshed?.openaiApiKeyEncrypted || refreshed?.maiaRouterApiKeyEncrypted,
    ),
    syncedAt: new Date().toISOString(),
  };
}

export async function translateForExtension(params: {
  licenseKey: string;
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  aiProvider?: AIProvider;
  mode: TranslationMode;
}): Promise<TranslationResponse> {
  const { settings } = await findLicenseOwnerWorkspace(params.licenseKey);
  const provider = params.aiProvider ?? settings.aiProvider;
  const encryptedKey =
    provider === "openai"
      ? settings.openaiApiKeyEncrypted
      : settings.maiaRouterApiKeyEncrypted;

  if (!encryptedKey) {
    throw new Error(
      provider === "openai" ? "OPENAI_KEY_REQUIRED" : "MAIA_ROUTER_KEY_REQUIRED",
    );
  }

  return translateText({
    text: params.text,
    sourceLanguage: params.sourceLanguage ?? settings.sourceLanguage,
    targetLanguage: params.targetLanguage ?? settings.targetLanguage,
    provider,
    mode: params.mode,
    apiKey: decryptSecret(encryptedKey),
  });
}
