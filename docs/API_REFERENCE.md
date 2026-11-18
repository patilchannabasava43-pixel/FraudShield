# Express API reference (optional)

This API runs only when you start `npm run dev:api` from the repository root (after installing backend dependencies), or when you deploy the backend. It does **not** access bank accounts or store user records. All results are transparent demo risk estimates.

**Local base:** `http://localhost:5000`  
**Frontend proxy:** `/api/*` → `http://127.0.0.1:5000/api/*`

## GET /api/health

```json
{"status":"ok","service":"FraudShield Risk API","engine":"rules-v1","mode":"synthetic-demo"}
```

## GET /api/risk/rules

Returns the default scoring thresholds and enabled signals.

## POST /api/risk/analyze

Body:

```json
{
  "transaction": {
    "merchant":"Demo Overseas Shop",
    "amount":45000,
    "velocity":4,
    "international":true,
    "newDevice":true,
    "unusualHours":false,
    "suspiciousMerchant":false
  },
  "rules":{"highAmount":25000,"velocityLimit":3}
}
```

Response shape:

```json
{
  "analysis": {
    "score": 98,
    "level": "high",
    "factors": [{"label":"Unusually high amount","detail":"...","points":28}]
  },
  "engine":"rules-v1",
  "disclaimer":"Demo score; not a calibrated fraud probability"
}
```

The example `factors` array is abbreviated; the API normally returns **all** applicable signals, and the response is deterministic for a given input and rules.

## POST /api/risk/batch

```json
{"transactions":[{"amount":1200,"velocity":1},{"amount":75000,"velocity":5,"international":true}]}
```

Returns an `analyses` array in input order; accepts 1–100 transactions.

## Validation and limits

- Amount must be a finite number between 0 and 10,000,000; velocity must be an integer from 0 to 1,000.
- Merchant labels are capped at 120 characters. Invalid rules and threshold inversions produce HTTP 400.
- JSON requests are capped at 32 KB. Risk endpoints are rate-limited (120 requests/15 minutes per IP).
- CORS is restricted to the comma-separated `FRONTEND_ORIGINS` configuration. Other HTTP clients may still call this **public demo API**.
- There is **no backend authentication**. Never send private financial information or assume an analysis is a trustworthy fraud verdict.

## Example curl

```bash
curl -X POST http://localhost:5000/api/risk/analyze \
  -H "Content-Type: application/json" \
  -d '{"transaction":{"amount":75000,"velocity":5,"international":true}}'
```