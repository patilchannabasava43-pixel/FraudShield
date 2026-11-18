# Testing and verification

## Automated unit tests

Run from repository root with Node.js 22+:

```bash
npm test
```

Tests cover:

| Area | Verification |
| --- | --- |
| Rule engine | Normal low-risk classification |
| Rule engine | Multiple anomaly signals → high risk |
| Rule engine | Disabling a signal reduces the score |
| Rule engine | INR formatter contract |
| API validators | Accepts valid synthetic transaction |
| API validators | Rejects negative/invalid amounts |
| API validators | Rejects bad risk thresholds |
| API validators | Applies safe rule defaults |

## HTTP integration tests

After installing backend dependencies, run `npm run test:api` to exercise the actual Express health and analysis endpoints on an ephemeral local port. This also checks rejection of invalid input.

## Production build

```bash
npm --prefix frontend install
npm run build
```

The GitHub Actions workflow `Code quality and build` runs install, unit tests and Vite build on PRs and commits to main. The build must pass before considering frontend compilation verified.

## Manual user journeys

1. Start the Vite app and register a new Supabase account (email verification if enabled).
2. Sign in and confirm synthetic sample transactions appear.
3. Simulate an overseas high-value payment; inspect the explanation details and alert queue.
4. Mark one alert as genuine; reload and verify review state persisted in Supabase.
5. Change the amount threshold; reload and check it persisted.
6. Sign out, sign in with a second account, and verify the first user's reviews are not visible.
7. Optional backend: start `npm run dev:api`, configure `frontend/.env.local` with `VITE_API_URL=/api`, restart Vite, and simulate again.
8. Use browser devtools to check for unauthorized requests/errors.

## Current verification boundary

The code's pure JavaScript engine and validators have local automated coverage. An actual Vite production build, Express HTTP test and live-browser Supabase test must be checked with working dependency installation and a browser. Do not claim these are complete without evidence.