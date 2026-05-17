ALTER TABLE "licenses" ADD COLUMN "activation_code" text;
UPDATE "licenses"
SET "activation_code" = CASE
  WHEN "activation_code_masked" = 'FLUE-CESS' THEN 'FLUENT-2026-ACCESS'
  WHEN "activation_code_masked" = 'REVO-NTKY' THEN 'REVOKED-FLUENT-KEY'
  ELSE 'LEGACY-' || upper(substr(md5("id"), 1, 16))
END;
ALTER TABLE "licenses" ALTER COLUMN "activation_code" SET NOT NULL;
ALTER TABLE "licenses" ADD COLUMN "issued_to_user_id" text;
ALTER TABLE "licenses" ADD COLUMN "issued_at" timestamp with time zone;
ALTER TABLE "user_settings" ADD COLUMN "openai_api_key_encrypted" text;
ALTER TABLE "user_settings" ADD COLUMN "openai_api_key_masked" text;
ALTER TABLE "user_settings" ADD COLUMN "maia_router_api_key_encrypted" text;
ALTER TABLE "user_settings" ADD COLUMN "maia_router_api_key_masked" text;
ALTER TABLE "user_settings" ADD COLUMN "entitled_at" timestamp with time zone;
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_issued_to_user_id_user_id_fk" FOREIGN KEY ("issued_to_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
CREATE UNIQUE INDEX "licenses_activation_code_unique" ON "licenses" USING btree ("activation_code");
CREATE UNIQUE INDEX "licenses_issued_to_user_unique" ON "licenses" USING btree ("issued_to_user_id");
