import { DEFAULT_RULES } from '../../shared/risk.js';

const invalid = (message) => { const error = new Error(message); error.status = 400; return error; };
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export function parseTransaction(value) {
  if (!isRecord(value)) throw invalid('Transaction must be an object');
  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000) {
    throw invalid('Amount must be between 0 and 10,000,000');
  }
  const velocity = Number(value.velocity ?? 1);
  if (!Number.isInteger(velocity) || velocity < 0 || velocity > 1000) throw invalid('Invalid velocity');
  const merchant = String(value.merchant ?? 'Demo merchant');
  if (merchant.length > 120) throw invalid('Merchant label too long');
  return {
    amount, velocity, merchant,
    international: value.international === true,
    newDevice: value.newDevice === true,
    unusualHours: value.unusualHours === true,
    suspiciousMerchant: value.suspiciousMerchant === true,
  };
}

export function parseRules(value) {
  if (value === undefined) return { ...DEFAULT_RULES };
  if (!isRecord(value)) throw invalid('Rules must be an object');
  const rules = { ...DEFAULT_RULES };
  const constraints = { highAmount: [1000, 1_000_000], velocityLimit: [1, 100], highRiskThreshold: [50, 98], mediumRiskThreshold: [1, 90] };
  for (const [field, [min,max]] of Object.entries(constraints)) {
    if (value[field] === undefined) continue;
    const v = Number(value[field]);
    if (!Number.isFinite(v) || v < min || v > max) throw invalid(`Invalid rule: ${field}`);
    rules[field] = v;
  }
  for (const field of ['monitorInternational','monitorNewDevices','monitorUnusualHours']) {
    if (value[field] === undefined) continue;
    if (typeof value[field] !== 'boolean') throw invalid(`Invalid rule: ${field}`);
    rules[field] = value[field];
  }
  if (rules.mediumRiskThreshold >= rules.highRiskThreshold) throw invalid('Medium threshold must be below high threshold');
  return rules;
}