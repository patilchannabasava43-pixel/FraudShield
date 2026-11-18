# Render deployment — Phase 3 (not deployed)

A blueprint is checked in as `render.yaml`, modeled for two separate Render services. No live FraudShield URL is claimed here.

## Services

**fraudshield-web**: static React/Vite application, repository root, build `cd frontend && npm install && npm run build`, publish `frontend/dist`; SPA rewrite `/* → /index.html`.

**fraudshield-api**: optional Express web service, repository root, build `cd backend && npm install`, start `node backend/src/server.js`, health endpoint `/api/health`.

The frontend works without the API; leave `VITE_API_URL` empty until the backend is live.

## Set environment variables in Render

| Service | Variable | Value |
| --- | --- | --- |
| Frontend | `VITE_SUPABASE_URL` | `https://lgpnfcocmfnhnsgeqbbu.supabase.co` |
| Frontend | `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe key from Supabase dashboard |
| Frontend | `VITE_API_URL` | Optional: `https://<api-host>/api` |
| Backend | `FRONTEND_ORIGINS` | Exact frontend origin, e.g. `https://<web-host>` |
| Backend | `NODE_ENV` | `production` |

Never use the Supabase **secret** key in frontend env vars. Publishable keys are intended to be visible in bundled JavaScript.

## Authentication configuration

When the frontend has a real Render URL, update **Supabase → Authentication → URL Configuration** to include the full HTTPS frontend origin in Site URL and allowed redirect URLs. Existing `http://localhost:5173` can remain as a development redirect if appropriate.

## Smoke tests

- Frontend root and a browser reload show the React interface (not a 404).
- Create an account and sign in, then verify Supabase records are scoped to that user.
- Simulate a synthetic transaction, review an alert, refresh, and check persistence.
- If API is enabled, call `GET https://<api-host>/api/health` and POST a harmless sample to `/api/risk/analyze`.
- Check Render logs and browser console for CORS or unauthorized errors.

## Caution

This blueprint is a **deployment starting point**. Confirm service-plan availability and current Render build settings in the dashboard before provisioning. Do not treat the optional public risk API as a financial decision service.