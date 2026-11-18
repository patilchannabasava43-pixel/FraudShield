import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeTransaction, DEFAULT_RULES, formatMoney } from '../shared/risk.js';

test('normal transaction is low risk', () => {
  const result = analyzeTransaction({amount: 100, velocity: 1}, DEFAULT_RULES);
  assert.equal(result.level, 'low');
  assert.ok(result.score >= 5 && result.score <= 98);
});

test('strong anomaly signals produce elevated risk and explanations', () => {
  const result = analyzeTransaction({amount: 90000, velocity: 6, international: true, newDevice: true, unusualHours: true, suspiciousMerchant: true});
  assert.equal(result.level, 'high');
  assert.ok(result.factors.some(x => x.label === 'International location'));
  assert.ok(result.score <= 98);
});

test('disabled signal does not add points', () => {
  const tx = {amount: 500, velocity: 1, international: true};
  const withSignal = analyzeTransaction(tx, DEFAULT_RULES);
  const without = analyzeTransaction(tx, {...DEFAULT_RULES, monitorInternational:false});
  assert.ok(withSignal.score > without.score);
});

test('currency formatter returns INR notation', () => {
  assert.match(formatMoney(1234), /^₹/);
});