export type AIProvider = "openai" | "maia_router";

export type Locale = "id" | "en";

export type LicenseStatus = "inactive" | "active" | "revoked";

export type LanguagePreference = {
  sourceLanguage: string;
  targetLanguage: string;
  aiProvider: AIProvider;
};

export type SettingsPreferences = LanguagePreference & {
  hasOpenAIApiKey: boolean;
  hasMaiaRouterApiKey: boolean;
  openAIApiKeyMasked: string | null;
  maiaRouterApiKeyMasked: string | null;
};

export type SettingsPreferenceInput = LanguagePreference & {
  openAIApiKey?: string;
  maiaRouterApiKey?: string;
  clearOpenAIApiKey?: boolean;
  clearMaiaRouterApiKey?: boolean;
};

export type LicenseSnapshot = {
  status: LicenseStatus;
  hasPurchased: boolean;
  licenseKey: string | null;
  licenseKeyMasked: string | null;
  lastCheckedAt: string | null;
};

export type ActivationResponse = {
  success: boolean;
  message: string;
  status: LicenseStatus;
  licenseKeyMasked: string | null;
};

export type TranslationMode = "read" | "write";

export type TranslationResponse = {
  provider: AIProvider;
  mode: TranslationMode;
  translatedText: string;
};

export type PurchaseOrderStatus = "pending" | "paid" | "expired" | "failed";

export type PurchaseOrderSummary = {
  id: string;
  status: PurchaseOrderStatus;
  checkoutUrl: string | null;
  customerMobile: string;
};
