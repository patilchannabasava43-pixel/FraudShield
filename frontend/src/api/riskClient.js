import { analyzeTransaction } from '../lib/risk';

// The Express API is optional until deployment. No private banking data leaves the browser.
// Configure VITE_API_URL=/api when the API server is running; otherwise use the same local demo engine.
export async function analyzeSimulatedTransaction(transaction, rules) {
  const base = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');
  if (!base) return analyzeTransaction(transaction, rules);

  const response = await fetch(`${base}/risk/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction, rules }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Risk API request failed (${response.status})`);
  }
  const result = await response.json();
  return result.analysis;
}