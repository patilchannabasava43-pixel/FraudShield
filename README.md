# FraudShield AI — Financial Fraud Monitoring Prototype

React + Vite dashboard with transparent **demo risk scoring**, synthetic transactions, and Supabase Auth + per-user persistence. **This is not a trained fraud detection model** and must not make real banking decisions.

## Running the website

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Phase 2: Supabase integration — connected

The dedicated **FraudShield** Supabase project has been created in Mumbai (`ap-south-1`) and its schema has been applied. The browser code includes its **public** project URL and publishable key, so no environment variables are needed for local development.

- **Supabase project:** https://supabase.com/dashboard/project/lgpnfcocmfnhnsgeqbbu
- **Project API URL:** https://lgpnfcocmfnhnsgeqbbu.supabase.co
- **Authentication:** email/password via Supabase Auth; user sessions persist in the browser.
- **Database:** `fraudshield_transactions` and `fraudshield_rules` with owner-only Row Level Security policies.
- **Storage:** synthetic transactions, review feedback and detection settings persist in Postgres for the signed-in account. Each user can see only their own records.

To run the connected app:

1. `npm install` and `npm run dev`; open `http://localhost:5173`.
2. Create an account with an email address and password. If Supabase email confirmation is enabled, verify the email before signing in.
3. If the confirmation link doesn't return to the local app, visit Supabase **Authentication → URL Configuration**, set the Site URL to `http://localhost:5173`, and allow `http://localhost:5173/**` as a redirect URL. Later add your production domain.
4. Sign in. The dashboard creates **synthetic** transaction records for each new user. Try simulating a transaction, reviewing an alert, and changing a rule; the changes are saved in Supabase.

The `src/lib/supabase.js` file contains **only** the Supabase URL and publishable browser key. It does **not** contain a secret or service-role key. Optional `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` values in `.env.local` can override the defaults for another project (do not commit `.env.local`).

The schema at `supabase/schema.sql` is already applied to the dedicated project; don't run it again unless you are setting up a new database. Supabase's security advisor reported no findings at initial setup.

### What is stored in Supabase?

- `fraudshield_transactions`: merchant, category, synthetic amount, risk flags, review status, and timestamps. Primary key `(user_id,id)`.
- `fraudshield_rules`: per-user JSON configuration for demo alert thresholds.
- Supabase Auth: registered accounts and sessions.

**No actual bank transactions are accessed.** The current risk scores are calculated in the browser from a rule-based heuristic (`src/lib/risk.js`), not a trusted server or trained ML model. For real financial use, scoring, validation, audits and fraud actions must move to a secure backend and be independently evaluated.

## Features

Overview dashboard, searchable transactions, fraud alerts, risk analytics, adjustable detection rules, synthetic transaction simulator, CSV export and local or remote persistence.

## Structure

```text
src/
  App.jsx                  # Dashboard screens and integration
  AuthScreen.jsx           # Email/password auth UI
  lib/supabase.js          # Browser client, public project configuration
  lib/workspace.js         # Supabase data access
  lib/risk.js              # Transparent demo heuristic
  data/transactions.js     # Synthetic fixture transactions
  styles.css               # UI and auth styling
supabase/schema.sql        # Per-user tables and RLS policies
```

## Next phase: Render deployment

`npm run build` produces `dist/`. Deploy as a static site with build command `npm ci && npm run build` **after generating and committing a package lockfile**, and optionally override the Vite variables at build time. The public default project configuration is already included. Render deployment has intentionally not been performed in Phase 2.
