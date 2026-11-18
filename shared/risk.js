/** Transparent demo heuristic, NOT a trained ML model or actual fraud decision. */
export const DEFAULT_RULES = {
  highAmount: 25000,
  velocityLimit: 3,
  highRiskThreshold: 70,
  mediumRiskThreshold: 40,
  monitorInternational: true,
  monitorNewDevices: true,
  monitorUnusualHours: true,
};

export function analyzeTransaction(tx, rules = DEFAULT_RULES) {
  let score = 7;
  const factors = [];
  const add = (points, label, detail) => {
    score += points;
    factors.push({ label, detail, points });
  };
  if (tx.amount >= rules.highAmount) {
    add(28, 'Unusually high amount', `Transaction exceeds your ₹${Number(rules.highAmount).toLocaleString('en-IN')} alert threshold.`);
  }
  if (tx.amount >= rules.highAmount * 2) add(9, 'Very large transaction', 'Amount is more than twice the configured threshold.');
  if (tx.international && rules.monitorInternational) add(22, 'International location', 'Payment originates outside the usual operating region.');
  if (tx.newDevice && rules.monitorNewDevices) add(19, 'Unrecognized device', 'The device has not appeared in this account history.');
  if (tx.velocity >= rules.velocityLimit) add(22, 'Rapid transaction activity', `${tx.velocity} transactions were observed in a short window.`);
  if (tx.unusualHours && rules.monitorUnusualHours) add(10, 'Unusual transaction hour', 'Timing differs from the account’s typical activity.');
  if (tx.suspiciousMerchant) add(14, 'Elevated merchant risk', 'This merchant category has been flagged for closer review.');
  score = Math.min(98, Math.max(5, score));
  const level = score >= rules.highRiskThreshold ? 'high' : score >= rules.mediumRiskThreshold ? 'medium' : 'low';
  if (!factors.length) factors.push({ label: 'Consistent with expected behavior', detail: 'No configured rule was triggered in this demonstration.', points: 0 });
  return { score, level, factors };
}

export const formatMoney = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const compactMoney = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${Math.round(n)}`;
export const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
export const formatDateTime = (date) => new Date(date).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });