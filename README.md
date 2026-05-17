# FluentRemote

FluentRemote is a Next.js 16 web app plus Chrome Extension MVP for multilingual client workflows. It includes:

- Better Auth with email/password and Google sign-in
- Drizzle ORM with PostgreSQL
- Mayar one-time payment flow
- license issuance and gated settings
- extension sync and translation APIs

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Better Auth
- Drizzle ORM
- PostgreSQL / Supabase Postgres

## Environment

Copy the example file first:

```powershell
Copy-Item .env.example .env
```

Important variables:

```env
DATABASE_URL=
DATABASE_SSL=auto
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
FLUENTREMOTE_ENCRYPTION_SECRET=
ADMIN_EMAILS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MAYAR_API_KEY=
MAYAR_WEBHOOK_TOKEN=
OPENAI_API_KEY=
MAIA_ROUTER_API_KEY=
```

`DATABASE_SSL=auto` is recommended. The app will automatically enable SSL for Supabase connections and keep local Postgres simple during development.

## Local Development

Run the app:

```powershell
npm install
npm run db:migrate
npm run dev
```

Useful commands:

```powershell
npm run lint
npm run build
npm run deploy:check
npm run db:check
npm run extension:package
```

## Move To Supabase Postgres

This project already uses plain PostgreSQL, so Supabase migration is mostly a connection-string cutover.

### 1. Create a Supabase project

Create a new project in the Supabase dashboard. Supabase gives every project a full Postgres database with an online dashboard, Table Editor, and SQL Editor.

### 2. Get the Postgres connection string

In Supabase, open your project database settings and copy the Postgres connection string.

Update `.env`:

```env
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=auto
```

Notes:

- `DATABASE_SSL=auto` is the safest default for Supabase.
- If you use a direct connection instead of the pooler, keep the same env pattern.

### 3. Verify the connection

```powershell
npm run db:check
```

If the connection is valid, you will see `Database connection OK`.

### 4. Apply the schema

For a fresh Supabase database:

```powershell
npm run db:migrate
```

### 4b. Migrate old local data

If you already used FluentRemote with the old local PostgreSQL database and want to move those rows into Supabase:

```powershell
npm run db:migrate-local-data
```

By default this reads from:

```env
LOCAL_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fluentremote
```

If your old local database lives somewhere else, set `LOCAL_DATABASE_URL` in `.env` before running the migration.

If you need initial sample rows for local testing only:

```powershell
npm run db:seed
```

### 5. Start the app

```powershell
npm run dev
```

## Online Database Access

One reason to use Supabase here is that you can inspect your production data from the browser:

- Table Editor for `user`, `licenses`, `purchase_orders`, `user_settings`, and auth tables
- SQL Editor for direct queries
- dashboard-based backups and database management

## Deployment Target

Recommended target: Vercel.

Why this target fits this repo:

- Next.js 16 is supported natively on Vercel.
- The app uses auth, route handlers, and payment webhooks, so it needs a full server deployment rather than a static export.
- GitHub import gives the fastest path from this repository to repeatable production deploys.

### Vercel setup

1. Import the GitHub repository into Vercel.
2. Keep the detected framework as `Next.js`.
3. Use Node.js `20.9+` or newer.
4. Add production environment variables before the first deploy.
5. Set the production domain, then update OAuth and auth callback URLs to match it.

Production environment checklist:

```env
DATABASE_URL=
DATABASE_SSL=auto
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://your-domain.example
FLUENTREMOTE_ENCRYPTION_SECRET=
ADMIN_EMAILS=admin@example.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MAYAR_API_KEY=
MAYAR_WEBHOOK_TOKEN=
MAYAR_BASE_URL=https://api.mayar.id/hl/v1
MAYAR_PRICE_AMOUNT=99000
MAYAR_CURRENCY=IDR
MAYAR_PRODUCT_DESCRIPTION=FluentRemote lifetime access
OPENAI_API_KEY=
OPENAI_TRANSLATION_MODEL=gpt-4o-mini
MAIA_ROUTER_API_KEY=
MAIA_ROUTER_BASE_URL=https://api.maiarouter.ai/v1
MAIA_ROUTER_MODEL=maia/gemini-2.5-flash
```

### Pre-deploy check

Run this locally before pushing deployment-related changes:

```powershell
npm run deploy:check
```

### Post-deploy verification

- Sign in with email/password works.
- Google OAuth callback returns to the production domain.
- `/settings` loads without database errors.
- Checkout can create a Mayar order.
- Mayar webhook can reach `/api/payments/mayar/webhook`.
- Extension-connected endpoints still work against the deployed backend.

### Security note

The previous `.env.example` contained real-looking secrets and has now been sanitized. Those credentials should be rotated in their respective providers because they were already committed once.

## Extension

The Chrome Extension MVP lives in:

`extension/`

Package it with:

```powershell
npm run extension:package
```

For local installation, use Chrome `Load unpacked` and select the `extension` folder.
