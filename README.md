# FraudShield AI — Phase 1: Interactive Website

A responsive fraud-detection dashboard prototype built with **React + Vite + Recharts**. The project is intentionally divided into phases:

1. **Now:** frontend website, fully usable with synthetic transactions and local browser storage.
2. **Later, when requested:** Supabase for database, user authentication, and persistent data.
3. **Later, when requested:** Render for production deployment and any backend services.

## Quick start

Requires Node.js 20.19+ or Node.js 22+.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (normally `http://localhost:5173`). To verify a production build:

```bash
npm run build
npm run preview
```

## Implemented pages

- **Overview:** KPIs, activity chart, fraud distribution, recent transactions, priority alerts
- **Transactions:** search, filter, inspect signals and risk score, review, export CSV
- **Fraud alerts:** queue of medium/high risk transactions with investigator feedback
- **Analytics:** spending trends, category volume, risk intelligence cards
- **Detection rules:** adjustable thresholds and signal toggles, instant recalculation
- **Settings:** saved demo state, planned phases, reset demo
- **Simulation:** generate high-risk and legitimate sample transactions; scoring produces human-readable reasons

## How fraud scoring works in this prototype

This is **not** a trained artificial-intelligence model. The algorithm in `src/lib/risk.js` assigns an illustrative score from 5–98 based on amount thresholds, international payments, device novelty, velocity, unusual hours, and merchant risk. The visible interface identifies this clearly as a demonstration.

All records are **synthetic**, generated in `src/data/transactions.js`. User interactions and rules are persisted in localStorage using `fraudshield_phase1_demo_v1`. There is no bank integration or collection of personal financial data.

## Structure

```text
src/
  App.jsx                 # React pages, navigation and interactions
  styles.css              # Responsive UI
  data/transactions.js    # Synthetic sample data and scenarios
  lib/risk.js             # Risk-scoring rules and formatting helpers
  main.jsx                # Entry point
```

## Phase 2 Supabase integration plan (not implemented yet)

When requested, replace demo localStorage with Supabase Auth and tables such as `profiles`, `transactions`, `risk_assessments`, `fraud_alerts`, `review_feedback`, and `detection_rules`. Apply authentication policies and per-user Row Level Security. Avoid storing real sensitive banking data in client-side code. Transactions should be scored in a trusted backend/Edge Function for any real deployment; avoid trusting browser-calculated risk decisions.

## Phase 3 Render deployment plan (not implemented yet)

Build with `npm ci && npm run build`, publish `dist/`. If an API is added later, host it separately and configure CORS plus environment variables securely.

## Important limitations

- Demonstration only; **never use the heuristic to make real financial decisions**, approve loans, block transactions, or classify individuals as fraudulent.
- No real AI training, user authentication, or Supabase/Render connection in this phase.
- Risk scores are not calibrated probabilities; they are explainable demo signals.
