# FraudShield AI — Financial Fraud Monitoring Prototype

React + Vite dashboard with transparent **demo risk scoring**, synthetic transactions, and optional Supabase Auth + per-user persistence. **This is not a trained fraud detection model** and must not make real banking decisions.

## Running the website

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Phase 2: Supabase integration

The website supports two modes:

- **Local demo** (no `.env` configuration): synthetic records and detection rules stored in `localStorage`, without authentication. The original Phase 1 demo remains available.
- **Supabase workspace** (`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` both configured): email/password sign-up and login, with private synthetic transaction records, review feedback and detection rules stored in Postgres. Each signed-in user can access only their own data through Row Level Security.

To connect the website to a **dedicated** Supabase project:

1. Create or select a project in [Supabase](https://supabase.com/dashboard), then wait for `ACTIVE_HEALTHY`.
2. Apply `supabase/schema.sql` once in the SQL Editor. This creates `fraudshield_transactions` and `fraudshield_rules` and enables owner-based Row Level Security.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the project's Connect / API Keys page. Use the **publishable** key (`sb_publishable_...`), **never** a secret or service role key. Restart `npm run dev`.
4. In Supabase Auth settings, enable email/password login; for confirmation links, add `http://localhost:5173` as an allowed redirect URL. Set the production URL when hosting later.
5. Sign up, confirm your email if required, and sign in. The dashboard seeds a **synthetic dataset for each new user** and saves simulations, reviews and rules under their own account.

For a hosted Vite build, set these same two environment variables in the hosting service **at build time**. Do not put private keys or real financial data into source control.

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
  lib/supabase.js          # Browser client, public env configuration
  lib/workspace.js         # Supabase data access
  lib/risk.js              # Transparent demo heuristic
  data/transactions.js     # Synthetic fixture transactions
  styles.css               # UI and auth styling
supabase/schema.sql        # Per-user tables and RLS policies
```

## Next phase: Render deployment

`npm run build` produces `dist/`. Deploy as a static site with build command `npm ci && npm run build` **after generating and committing a package lockfile**, and set the Vite variables at build time. Render deployment has intentionally not been performed in Phase 2.
