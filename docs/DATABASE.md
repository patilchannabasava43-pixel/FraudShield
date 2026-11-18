# Supabase integration and database

## Project

FraudShield uses a dedicated Supabase project in Mumbai (`ap-south-1`):

- Dashboard: https://supabase.com/dashboard/project/lgpnfcocmfnhnsgeqbbu
- API URL: `https://lgpnfcocmfnhnsgeqbbu.supabase.co`
- Auth provider: Supabase email/password.

The browser may contain the project URL and the **publishable** key. Never put the secret/service-role key into `VITE_*`, frontend JavaScript, or Git.

## Tables

The exact schema is defined in [`supabase/schema.sql`](../supabase/schema.sql) and has already been applied to the dedicated project.

### fraudshield_transactions

A composite primary key `(user_id, id)` identifies each synthetic transaction. Fields include merchant, category, amount, location, transaction time, account display label, payment channel, anomaly flags, review state, and a simulated marker. `user_id` references `auth.users(id)` with cascade deletion.

### fraudshield_rules

A unique `user_id` owns a JSONB settings document. This stores the frontend's adjustable scoring thresholds. The table also has an `updated_at` timestamp (currently set on insertion; no automatic update trigger is installed).

## Row Level Security

Both tables have RLS enabled. Each has four policies for authenticated users: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Every policy checks the authenticated user's ID against the row's `user_id`; update policies check both existing and new row ownership. Anonymous Data API access is explicitly revoked. Supabase's initial security-advisor review returned **zero findings**.

This is meaningful per-user isolation, but end-to-end auth and adversarial RLS testing are still recommended before public deployment.

## Data lifecycle

- First sign-in populates the account with **synthetic** example transactions if no saved transactions exist.
- Simulations insert one synthetic transaction under the signed-in user's identity.
- Fraud/genuine reviews update only that user's row.
- Detection rules are upserted to the user's settings row.
- Reset replaces the user's sample transactions and restores default rules.
- No real bank feeds or financial API keys exist.

## Common troubleshooting

- **Email verification link redirects incorrectly:** In Supabase → Authentication → URL Configuration, set Site URL to `http://localhost:5173`, and include `http://localhost:5173/**` as a redirect for development. Add a Render URL during Phase 3.
- **`relation does not exist`:** Ensure `supabase/schema.sql` was applied to the correct project.
- **`permission denied` or empty updates:** Confirm the user is signed in and the JWT/RLS owner ID matches the row; UPDATE requires SELECT and UPDATE policies.
- **No data after login:** On first sign-in, `loadWorkspace` inserts synthetic data; inspect the browser console and Supabase error message if a request fails.