# Security and privacy notes

## Scope

FraudShield AI is an **academic synthetic-data prototype**. No production fraud decisions, bank integrations, genuine financial account credentials, or real-money operations are implemented.

## What is protected

- Supabase Auth handles browser sessions; custom passwords are not stored in `fraudshield_transactions`.
- Both tables use owner-scoped Row Level Security. Their Data API roles grant permissions to authenticated users but never bypass RLS.
- Only a Supabase **publishable** key is present in frontend configuration. Public keys are intended for client code; they are **not authentication secrets**.
- The optional Express API has bounded payloads, CORS configuration, rate limiting, and no database service-role key.
- `.gitignore` excludes `.env` and `.env.*` while keeping `.env.example` templates.

## Known limitations

- The heuristic assigns risk based on user-supplied/synthetic flags and must not be used for real payment blocking.
- Browser-visible scoring rules can be modified by users. There is no fraud-resistant server-side adjudication.
- Express demo scoring endpoint is unauthenticated and intended only for fake test inputs. Avoid sending real customer transaction details.
- Confirm email redirect settings, Supabase RLS behavior with two accounts, and HTTPS/CORS after deployment.
- No validated precision, recall or false-positive-rate numbers are claimed without a labeled evaluation dataset.

## Before production

1. Replace demonstration-only components with a reviewed risk-model service and labeled validation methodology.
2. Add server-side authorization and token verification if the backend receives private user data.
3. Run dependency security audits and resolve relevant vulnerabilities before sharing broadly.
4. Add audit logs, abuse detection, secrets management, retention policies, and a privacy notice.
5. Test RLS with at least two accounts and document negative-path results.
6. Add automated frontend E2E tests covering register → verify email → login → simulate → review → sign out.

Please report suspected security issues privately to the repository owner rather than posting secrets in public issues.