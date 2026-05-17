CREATE TYPE "public"."purchase_order_status" AS ENUM('pending', 'paid', 'expired', 'failed');
CREATE TABLE "purchase_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" text DEFAULT 'mayar' NOT NULL,
	"status" "purchase_order_status" DEFAULT 'pending' NOT NULL,
	"amount" text NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_mobile" text NOT NULL,
	"mayar_payment_request_id" text,
	"mayar_transaction_id" text,
	"checkout_url" text,
	"redirect_url" text,
	"description" text,
	"raw_create_response" jsonb DEFAULT null,
	"raw_webhook_payload" jsonb DEFAULT null,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
CREATE UNIQUE INDEX "purchase_orders_mayar_payment_request_id_unique" ON "purchase_orders" USING btree ("mayar_payment_request_id");
CREATE UNIQUE INDEX "purchase_orders_mayar_transaction_id_unique" ON "purchase_orders" USING btree ("mayar_transaction_id");
