import { relations, sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const aiProviderEnum = pgEnum("ai_provider", ["openai", "maia_router"]);
export const licenseRecordStatusEnum = pgEnum("license_record_status", [
  "available",
  "activated",
  "revoked",
]);
export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
  "pending",
  "paid",
  "expired",
  "failed",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" })
      .notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    tokenUnique: uniqueIndex("session_token_unique").on(table.token),
  }),
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  }),
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    identifierValueUnique: uniqueIndex("verification_identifier_value_unique").on(
      table.identifier,
      table.value,
    ),
  }),
);

export const licenses = pgTable(
  "licenses",
  {
    id: text("id").primaryKey(),
    activationCode: text("activation_code").notNull(),
    activationCodeHash: text("activation_code_hash").notNull(),
    activationCodeMasked: text("activation_code_masked").notNull(),
    status: licenseRecordStatusEnum("status").notNull().default("available"),
    issuedToUserId: text("issued_to_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    activatedByUserId: text("activated_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    activatedByDeviceId: text("activated_by_device_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true, mode: "date" }),
    activatedAt: timestamp("activated_at", { withTimezone: true, mode: "date" }),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
  },
  (table) => ({
    activationCodeUnique: uniqueIndex("licenses_activation_code_unique").on(
      table.activationCode,
    ),
    activationCodeHashUnique: uniqueIndex("licenses_activation_code_hash_unique").on(
      table.activationCodeHash,
    ),
    issuedToUserUnique: uniqueIndex("licenses_issued_to_user_unique").on(
      table.issuedToUserId,
    ),
  }),
);

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  licenseId: text("license_id").references(() => licenses.id, {
    onDelete: "set null",
  }),
  sourceLanguage: text("source_language").notNull().default("Indonesian"),
  targetLanguage: text("target_language").notNull().default("English"),
  aiProvider: aiProviderEnum("ai_provider").notNull().default("openai"),
  openaiApiKeyEncrypted: text("openai_api_key_encrypted"),
  openaiApiKeyMasked: text("openai_api_key_masked"),
  maiaRouterApiKeyEncrypted: text("maia_router_api_key_encrypted"),
  maiaRouterApiKeyMasked: text("maia_router_api_key_masked"),
  entitledAt: timestamp("entitled_at", { withTimezone: true, mode: "date" }),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const deviceInstallations = pgTable("device_installations", {
  id: text("id").primaryKey(),
  licenseId: text("license_id").references(() => licenses.id, {
    onDelete: "set null",
  }),
  sourceLanguage: text("source_language").notNull().default("Indonesian"),
  targetLanguage: text("target_language").notNull().default("English"),
  aiProvider: aiProviderEnum("ai_provider").notNull().default("openai"),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("mayar"),
    status: purchaseOrderStatusEnum("status").notNull().default("pending"),
    amount: text("amount").notNull(),
    currency: text("currency").notNull().default("IDR"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerMobile: text("customer_mobile").notNull(),
    mayarPaymentRequestId: text("mayar_payment_request_id"),
    mayarTransactionId: text("mayar_transaction_id"),
    checkoutUrl: text("checkout_url"),
    redirectUrl: text("redirect_url"),
    description: text("description"),
    rawCreateResponse: jsonb("raw_create_response")
      .$type<Record<string, unknown> | null>()
      .default(sql`null`),
    rawWebhookPayload: jsonb("raw_webhook_payload")
      .$type<Record<string, unknown> | null>()
      .default(sql`null`),
    paidAt: timestamp("paid_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    mayarPaymentRequestIdUnique: uniqueIndex(
      "purchase_orders_mayar_payment_request_id_unique",
    ).on(table.mayarPaymentRequestId),
    mayarTransactionIdUnique: uniqueIndex(
      "purchase_orders_mayar_transaction_id_unique",
    ).on(table.mayarTransactionId),
  }),
);

export const usageLogs = pgTable("usage_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  deviceId: text("device_id"),
  action: text("action").notNull(),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  settings: one(userSettings),
  issuedLicenses: many(licenses, { relationName: "issuedLicenses" }),
  activatedLicenses: many(licenses, { relationName: "activatedLicenses" }),
  purchaseOrders: many(purchaseOrders),
}));

export const licenseRelations = relations(licenses, ({ one }) => ({
  issuedToUser: one(user, {
    relationName: "issuedLicenses",
    fields: [licenses.issuedToUserId],
    references: [user.id],
  }),
  activatedByUser: one(user, {
    relationName: "activatedLicenses",
    fields: [licenses.activatedByUserId],
    references: [user.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
  license: one(licenses, {
    fields: [userSettings.licenseId],
    references: [licenses.id],
  }),
}));

export const deviceInstallationsRelations = relations(
  deviceInstallations,
  ({ one }) => ({
    license: one(licenses, {
      fields: [deviceInstallations.licenseId],
      references: [licenses.id],
    }),
  }),
);

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one }) => ({
  user: one(user, {
    fields: [purchaseOrders.userId],
    references: [user.id],
  }),
}));

export type AppDatabaseSchema = typeof import("./schema");
