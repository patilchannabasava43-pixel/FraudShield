import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRules, parseTransaction } from '../src/validators.js';

test('accepts valid synthetic transactions', () => {
  const row = parseTransaction({merchant:'Demo', amount:1200, velocity:2,newDevice:true});
  assert.equal(row.amount,1200);
  assert.equal(row.newDevice,true);
});

test('rejects invalid transaction amount', () => {
  assert.throws(() => parseTransaction({ amount: -5 }), /Amount/);
});

test('rejects invalid rule threshold', () => {
  assert.throws(() => parseRules({ highRiskThreshold:0 }), /Invalid rule/);
  assert.throws(() => parseRules({ mediumRiskThreshold:88,highRiskThreshold:70 }), /below high/);
});

test('merges safe overrides with default risk rules', () => {
  const rules = parseRules({highAmount:30000});
  assert.equal(rules.highAmount,30000);
  assert.equal(rules.monitorInternational,true);
});