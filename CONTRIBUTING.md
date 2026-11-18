# Contributing to FraudShield AI

Thank you for helping improve the academic fraud-risk demonstration.

## Before opening a pull request

1. Fork and create a feature branch from `main`.
2. Keep synthetic-data and financial-safety disclosures accurate. Do not introduce real customer/bank data.
3. Install frontend dependencies, run `npm test`, then run `npm run build`.
4. For database changes, add/modify an SQL migration with owner-scoped RLS, and document the change in `docs/DATABASE.md`.
5. Keep secrets out of commits (`.env.example` files contain only example/publishable values).
6. Describe your change, screenshots if UI changes, tests performed and known limitations.

## Code conventions

- Reusable UI: `frontend/src/components`; pages: `frontend/src/pages`.
- Shared pure fraud demo rules: `shared/risk.js`. Both frontend and backend import this module.
- Optional HTTP API: `backend/src`; keep all validation close to the endpoint.
- Avoid magic risk probabilities and undisclosed financial claims.

## Issue reports

Include steps to reproduce, expected/actual behavior, Node.js version, and relevant non-sensitive logs. Never paste passwords, tokens or customer data.