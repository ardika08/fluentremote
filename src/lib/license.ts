import { createHash, randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";

import { getDb, isDatabaseConfigured } from "@/db";
import { deviceInstallations, licenses, userSettings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { decryptSecret, encryptSecret, maskSecret } from "@/lib/secrets";
import type {
  ActivationResponse,
  AIProvider,
  LanguagePreference,
  LicenseSnapshot,
  LicenseStatus,
  Locale,
  SettingsPreferenceInput,
  SettingsPreferences,
} from "@/types/domain";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const DEVICE_COOKIE_NAME = "fr_device_id";

const DEFAULT_PREFERENCES: LanguagePreference = {
  sourceLanguage: "Indonesian",
  targetLanguage: "English",
  aiProvider: "openai",
};

function baseCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    // httpOnly: false — cookies must be readable by the extension content script
    // running on the same domain. Extension access requires non-httpOnly cookies.
    httpOnly: false,
    sameSite: "lax" as const,
    // Enforce Secure in production so cookies are only sent over HTTPS
    secure: isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

function normalizeActivationCode(code: string) {
  return code.trim().toUpperCase();
}

function maskLicenseCode(code: string) {
  const compact = code.replace(/[^A-Za-z0-9]/g, "");
  if (compact.length <= 8) return code.toUpperCase();
  return `${compact.slice(0, 4).toUpperCase()}-${compact.slice(-4).toUpperCase()}`;
}

function hashActivationCode(code: string) {
  return createHash("sha256").update(normalizeActivationCode(code)).digest("hex");
}

function generateLicenseCode() {
  const compact = randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase();
  const groups = compact.match(/.{1,4}/g)?.join("-") ?? compact;
  return `FLR-${groups}`;
}

function isProductionLicenseCode(code: string | null | undefined) {
  if (!code) return false;
  return /^FLR-(?:[A-Z0-9]{4}-){3}[A-Z0-9]{4}$/i.test(code.trim());
}

function getActivationMessages(locale: Locale) {
  if (locale === "id") {
    return {
      empty: "Masukkan kode lisensi untuk melanjutkan.",
      revoked: "Kode lisensi ini sudah dicabut. Silakan hubungi support.",
      success: "Lisensi berhasil ditautkan ke workspace Anda.",
      invalid: "Kode lisensi tersebut tidak valid untuk akun ini.",
    };
  }

  return {
    empty: "Enter a license code to continue.",
    revoked: "This license code has been revoked. Please contact support.",
    success: "The license has been linked to your workspace.",
    invalid: "That license code is not valid for this account.",
  };
}

function buildEmptySettings(
  overrides?: Partial<SettingsPreferences>,
): SettingsPreferences {
  return {
    ...DEFAULT_PREFERENCES,
    hasOpenAIApiKey: false,
    hasMaiaRouterApiKey: false,
    openAIApiKeyMasked: null,
    maiaRouterApiKeyMasked: null,
    ...overrides,
  };
}

function toPublicLicenseStatus(
  status: "available" | "activated" | "revoked" | null | undefined,
  hasPurchased: boolean,
): LicenseStatus {
  if (status === "revoked") return "revoked";
  if (hasPurchased) return "active";
  return "inactive";
}

async function getSessionUserId() {
  if (!isDatabaseConfigured()) return null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user.id ?? null;
  } catch {
    return null;
  }
}

async function getDeviceId(options?: { persist?: boolean }) {
  const persist = options?.persist ?? false;
  const store = await cookies();
  let deviceId = store.get(DEVICE_COOKIE_NAME)?.value ?? null;

  if (!deviceId && persist) {
    deviceId = randomUUID();
    store.set(DEVICE_COOKIE_NAME, deviceId, baseCookieOptions());
  }

  return deviceId;
}

async function ensureUserWorkspace(userId: string) {
  const db = getDb();

  await db
    .insert(userSettings)
    .values({
      userId,
      sourceLanguage: DEFAULT_PREFERENCES.sourceLanguage,
      targetLanguage: DEFAULT_PREFERENCES.targetLanguage,
      aiProvider: DEFAULT_PREFERENCES.aiProvider,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date(),
    })
    .onConflictDoNothing();
}

async function getUserSettingsRecord(userId: string) {
  const db = getDb();

  return db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
    with: {
      license: true,
    },
  });
}

async function getDatabaseSnapshot(): Promise<LicenseSnapshot> {
  const userId = await getSessionUserId();

  if (userId) {
    await ensureUserWorkspace(userId);
    const settings = await getUserSettingsRecord(userId);
    const hasPurchased = Boolean(settings?.entitledAt && settings.license);

    return {
      status: toPublicLicenseStatus(settings?.license?.status, hasPurchased),
      hasPurchased,
      licenseKey:
        hasPurchased && settings?.license?.status !== "revoked"
          ? settings?.license?.activationCode ?? null
          : null,
      licenseKeyMasked: hasPurchased
        ? settings?.license?.activationCodeMasked ?? null
        : null,
      lastCheckedAt: hasPurchased
        ? settings?.license?.issuedAt?.toISOString() ??
          settings?.lastActiveAt?.toISOString() ??
          null
        : null,
    };
  }

  const deviceId = await getDeviceId();
  const db = getDb();

  if (!deviceId) {
    return {
      status: "inactive",
      hasPurchased: false,
      licenseKey: null,
      licenseKeyMasked: null,
      lastCheckedAt: null,
    };
  }

  const installation = await db.query.deviceInstallations.findFirst({
    where: eq(deviceInstallations.id, deviceId),
    with: { license: true },
  });

  return {
    status: toPublicLicenseStatus(
      installation?.license?.status,
      Boolean(installation?.licenseId),
    ),
    hasPurchased: Boolean(installation?.licenseId),
    licenseKey: null,
    licenseKeyMasked: installation?.license?.activationCodeMasked ?? null,
    lastCheckedAt: installation?.lastActiveAt?.toISOString() ?? null,
  };
}

async function getDatabasePreferences(): Promise<SettingsPreferences> {
  const userId = await getSessionUserId();

  if (userId) {
    await ensureUserWorkspace(userId);
    const settings = await getUserSettingsRecord(userId);

    if (settings) {
      return buildEmptySettings({
        sourceLanguage: settings.sourceLanguage,
        targetLanguage: settings.targetLanguage,
        aiProvider: settings.aiProvider,
        hasOpenAIApiKey: Boolean(settings.openaiApiKeyEncrypted),
        hasMaiaRouterApiKey: Boolean(settings.maiaRouterApiKeyEncrypted),
        openAIApiKeyMasked: settings.openaiApiKeyMasked ?? null,
        maiaRouterApiKeyMasked: settings.maiaRouterApiKeyMasked ?? null,
      });
    }
  }

  const deviceId = await getDeviceId();
  const db = getDb();

  if (deviceId) {
    const installation = await db.query.deviceInstallations.findFirst({
      where: eq(deviceInstallations.id, deviceId),
    });

    if (installation) {
      return buildEmptySettings({
        sourceLanguage: installation.sourceLanguage,
        targetLanguage: installation.targetLanguage,
        aiProvider: installation.aiProvider,
      });
    }
  }

  return buildEmptySettings();
}

export async function issueLicenseForUser(userId: string) {
  const db = getDb();
  await ensureUserWorkspace(userId);

  const existingSettings = await getUserSettingsRecord(userId);
  if (
    existingSettings?.license &&
    isProductionLicenseCode(existingSettings.license.activationCode) &&
    existingSettings.license.issuedToUserId === userId &&
    existingSettings.license.status !== "revoked"
  ) {
    return existingSettings.license;
  }

  if (existingSettings?.license) {
    await db
      .update(licenses)
      .set({
        status: "revoked",
        issuedToUserId: null,
        revokedAt: existingSettings.license.revokedAt ?? new Date(),
      })
      .where(eq(licenses.id, existingSettings.license.id));
  }

  const activationCode = generateLicenseCode();
  const created = {
    id: randomUUID(),
    activationCode,
    activationCodeHash: hashActivationCode(activationCode),
    activationCodeMasked: maskLicenseCode(activationCode),
    status: "available" as const,
    issuedToUserId: userId,
    issuedAt: new Date(),
  };

  await db.insert(licenses).values(created);

  await db
    .update(userSettings)
    .set({
      licenseId: created.id,
      entitledAt: new Date(),
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId));

  return created;
}

async function activateInDatabase(
  activationCode: string,
  locale: Locale,
): Promise<ActivationResponse> {
  const messages = getActivationMessages(locale);
  const normalized = normalizeActivationCode(activationCode);

  if (!normalized) {
    return {
      success: false,
      message: messages.empty,
      status: "inactive",
      licenseKeyMasked: null,
    };
  }

  const db = getDb();
  const userId = await getSessionUserId();
  const deviceId = await getDeviceId({ persist: true });
  const activationCodeHash = hashActivationCode(normalized);

  const license = await db.query.licenses.findFirst({
    where: eq(licenses.activationCodeHash, activationCodeHash),
  });

  if (!license) {
    return {
      success: false,
      message: messages.invalid,
      status: "inactive",
      licenseKeyMasked: null,
    };
  }

  if (!isProductionLicenseCode(license.activationCode)) {
    return {
      success: false,
      message: messages.invalid,
      status: "inactive",
      licenseKeyMasked: null,
    };
  }

  if (license.status === "revoked") {
    return {
      success: false,
      message: messages.revoked,
      status: "revoked",
      licenseKeyMasked: license.activationCodeMasked,
    };
  }

  if (userId) {
    await ensureUserWorkspace(userId);

    if (license.issuedToUserId && license.issuedToUserId !== userId) {
      return {
        success: false,
        message: messages.invalid,
        status: "inactive",
        licenseKeyMasked: null,
      };
    }

    await db
      .update(licenses)
      .set({
        issuedToUserId: userId,
        issuedAt: license.issuedAt ?? new Date(),
        status: "activated",
        activatedByUserId: userId,
        activatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id));

    await db
      .update(userSettings)
      .set({
        licenseId: license.id,
        entitledAt: new Date(),
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId));

    return {
      success: true,
      message: messages.success,
      status: "active",
      licenseKeyMasked: license.activationCodeMasked,
    };
  }

  if (deviceId) {
    await db
      .update(licenses)
      .set({
        status: "activated",
        activatedByDeviceId: deviceId,
        activatedAt: new Date(),
      })
      .where(eq(licenses.id, license.id));

    await db
      .insert(deviceInstallations)
      .values({
        id: deviceId,
        licenseId: license.id,
        sourceLanguage: DEFAULT_PREFERENCES.sourceLanguage,
        targetLanguage: DEFAULT_PREFERENCES.targetLanguage,
        aiProvider: DEFAULT_PREFERENCES.aiProvider,
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: deviceInstallations.id,
        set: {
          licenseId: license.id,
          lastActiveAt: new Date(),
          updatedAt: new Date(),
        },
      });
  }

  return {
    success: true,
    message: messages.success,
    status: "active",
    licenseKeyMasked: license.activationCodeMasked,
  };
}

async function saveDatabasePreferences(
  preferences: SettingsPreferenceInput,
): Promise<SettingsPreferences> {
  const db = getDb();
  const userId = await getSessionUserId();
  const deviceId = await getDeviceId({ persist: true });

  if (userId) {
    await ensureUserWorkspace(userId);
    const existing = await getUserSettingsRecord(userId);
    const hasPurchased = Boolean(existing?.entitledAt && existing.licenseId);
    const wantsSensitiveSave = Boolean(
      preferences.openAIApiKey?.trim() ||
        preferences.maiaRouterApiKey?.trim() ||
        preferences.clearOpenAIApiKey ||
        preferences.clearMaiaRouterApiKey,
    );

    if (wantsSensitiveSave && !hasPurchased) {
      throw new Error("PURCHASE_REQUIRED");
    }

    await db
      .update(userSettings)
      .set({
        sourceLanguage: preferences.sourceLanguage,
        targetLanguage: preferences.targetLanguage,
        aiProvider: preferences.aiProvider,
        openaiApiKeyEncrypted: preferences.clearOpenAIApiKey
          ? null
          : preferences.openAIApiKey?.trim()
            ? encryptSecret(preferences.openAIApiKey.trim())
            : existing?.openaiApiKeyEncrypted ?? null,
        openaiApiKeyMasked: preferences.clearOpenAIApiKey
          ? null
          : preferences.openAIApiKey?.trim()
            ? maskSecret(preferences.openAIApiKey) ??
              existing?.openaiApiKeyMasked ??
              null
            : existing?.openaiApiKeyMasked ?? null,
        maiaRouterApiKeyEncrypted: preferences.clearMaiaRouterApiKey
          ? null
          : preferences.maiaRouterApiKey?.trim()
            ? encryptSecret(preferences.maiaRouterApiKey.trim())
            : existing?.maiaRouterApiKeyEncrypted ?? null,
        maiaRouterApiKeyMasked: preferences.clearMaiaRouterApiKey
          ? null
          : preferences.maiaRouterApiKey?.trim()
            ? maskSecret(preferences.maiaRouterApiKey) ??
              existing?.maiaRouterApiKeyMasked ??
              null
            : existing?.maiaRouterApiKeyMasked ?? null,
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userSettings.userId, userId));

    return getDatabasePreferences();
  }

  if (deviceId) {
    const existingInstallation = await db.query.deviceInstallations.findFirst({
      where: eq(deviceInstallations.id, deviceId),
    });

    await db
      .insert(deviceInstallations)
      .values({
        id: deviceId,
        licenseId: existingInstallation?.licenseId ?? null,
        sourceLanguage: preferences.sourceLanguage,
        targetLanguage: preferences.targetLanguage,
        aiProvider: preferences.aiProvider,
        lastActiveAt: new Date(),
        createdAt: existingInstallation?.createdAt ?? new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: deviceInstallations.id,
        set: {
          sourceLanguage: preferences.sourceLanguage,
          targetLanguage: preferences.targetLanguage,
          aiProvider: preferences.aiProvider,
          lastActiveAt: new Date(),
          updatedAt: new Date(),
        },
      });
  }

  return getDatabasePreferences();
}

async function getDatabaseProviderApiKey(provider: AIProvider) {
  const userId = await getSessionUserId();

  if (!userId) {
    throw new Error("AUTH_REQUIRED");
  }

  const settings = await getUserSettingsRecord(userId);

  if (!settings?.entitledAt || !settings.licenseId || settings.license?.status === "revoked") {
    throw new Error("PURCHASE_REQUIRED");
  }

  const encryptedValue =
    provider === "openai"
      ? settings.openaiApiKeyEncrypted
      : settings.maiaRouterApiKeyEncrypted;

  if (!encryptedValue) {
    throw new Error(
      provider === "openai" ? "OPENAI_KEY_REQUIRED" : "MAIA_ROUTER_KEY_REQUIRED",
    );
  }

  return decryptSecret(encryptedValue);
}

async function legacyGetLicenseSnapshot(): Promise<LicenseSnapshot> {
  const store = await cookies();
  const status = (store.get("fr_license_status")?.value as LicenseStatus) ?? "inactive";
  const masked = store.get("fr_license_masked")?.value ?? null;

  return {
    status,
    hasPurchased: status === "active",
    licenseKey: null,
    licenseKeyMasked: masked,
    lastCheckedAt: store.get("fr_license_checked_at")?.value ?? null,
  };
}

async function legacyActivateLicense(
  activationCode: string,
  locale: Locale,
): Promise<ActivationResponse> {
  const normalized = normalizeActivationCode(activationCode);
  const messages = getActivationMessages(locale);

  let result: ActivationResponse;

  if (!normalized) {
    result = {
      success: false,
      message: messages.empty,
      status: "inactive",
      licenseKeyMasked: null,
    };
  } else if (normalized === "REVOKED-FLUENT-KEY") {
    result = {
      success: false,
      message: messages.revoked,
      status: "revoked",
      licenseKeyMasked: "REVO-NTKY",
    };
  } else if (/^FLUENT[A-Z0-9-]{8,}$/i.test(normalized)) {
    result = {
      success: true,
      message: messages.success,
      status: "active",
      licenseKeyMasked: maskLicenseCode(normalized),
    };
  } else {
    result = {
      success: false,
      message: messages.invalid,
      status: "inactive",
      licenseKeyMasked: null,
    };
  }

  const store = await cookies();
  const options = baseCookieOptions();

  store.set("fr_license_status", result.status, options);
  store.set("fr_license_checked_at", new Date().toISOString(), options);

  if (result.licenseKeyMasked) {
    store.set("fr_license_masked", result.licenseKeyMasked, options);
  } else {
    store.delete("fr_license_masked");
  }

  return result;
}

async function legacyGetPreferences(): Promise<SettingsPreferences> {
  const store = await cookies();

  return buildEmptySettings({
    sourceLanguage:
      store.get("fr_source_language")?.value ?? DEFAULT_PREFERENCES.sourceLanguage,
    targetLanguage:
      store.get("fr_target_language")?.value ?? DEFAULT_PREFERENCES.targetLanguage,
    aiProvider:
      (store.get("fr_ai_provider")?.value as AIProvider) ??
      DEFAULT_PREFERENCES.aiProvider,
  });
}

async function legacySavePreferences(
  preferences: SettingsPreferenceInput,
): Promise<SettingsPreferences> {
  const store = await cookies();
  const options = baseCookieOptions();

  store.set("fr_source_language", preferences.sourceLanguage, options);
  store.set("fr_target_language", preferences.targetLanguage, options);
  store.set("fr_ai_provider", preferences.aiProvider, options);

  return legacyGetPreferences();
}

export async function getLicenseSnapshot(): Promise<LicenseSnapshot> {
  if (!isDatabaseConfigured()) {
    return legacyGetLicenseSnapshot();
  }

  return getDatabaseSnapshot();
}

export async function activateLicense(
  activationCode: string,
  locale: Locale,
): Promise<ActivationResponse> {
  if (!isDatabaseConfigured()) {
    return legacyActivateLicense(activationCode, locale);
  }

  return activateInDatabase(activationCode, locale);
}

export async function getPreferences(): Promise<SettingsPreferences> {
  if (!isDatabaseConfigured()) {
    return legacyGetPreferences();
  }

  return getDatabasePreferences();
}

export async function savePreferences(
  preferences: SettingsPreferenceInput,
): Promise<SettingsPreferences> {
  if (!isDatabaseConfigured()) {
    return legacySavePreferences(preferences);
  }

  return saveDatabasePreferences(preferences);
}

export async function getProviderApiKeyForCurrentUser(provider: AIProvider) {
  if (!isDatabaseConfigured()) {
    if (provider === "openai") {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OPENAI_KEY_REQUIRED");
      return apiKey;
    }

    const apiKey = process.env.MAIA_ROUTER_API_KEY;
    if (!apiKey) throw new Error("MAIA_ROUTER_KEY_REQUIRED");
    return apiKey;
  }

  return getDatabaseProviderApiKey(provider);
}
