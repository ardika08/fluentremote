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

## Deployment Notes

- Put the same Supabase `DATABASE_URL` and `DATABASE_SSL=auto` into your hosting provider environment variables.
- Keep `BETTER_AUTH_URL` pointed to your production domain.
- Keep `FLUENTREMOTE_ENCRYPTION_SECRET`, Google OAuth, Mayar, and provider API variables set in production.
- After deploy, verify:
  - sign in works
  - Google OAuth callback works
  - Mayar webhook reaches the deployed app
  - `/settings` loads without database errors

## Extension

The Chrome Extension MVP lives in:

`extension/`

Package it with:

```powershell
npm run extension:package
```

For local installation, use Chrome `Load unpacked` and select the `extension` folder.
