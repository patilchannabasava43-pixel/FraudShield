import { supabase } from './supabase';
import { initialTransactions } from '../data/transactions';
import { DEFAULT_RULES } from './risk';

const TABLE = 'fraudshield_transactions';
const RULES_TABLE = 'fraudshield_rules';

function assertOk({ error }) {
  if (error) throw new Error(error.message);
}

export function toRecord(userId, tx) {
  return {
    user_id: userId, id: tx.id, merchant: tx.merchant, category: tx.category,
    amount: tx.amount, location: tx.location, international: Boolean(tx.international),
    new_device: Boolean(tx.newDevice), velocity: tx.velocity,
    suspicious_merchant: Boolean(tx.suspiciousMerchant),
    unusual_hours: Boolean(tx.unusualHours), occurred_at: tx.timestamp,
    account_label: tx.account, channel: tx.channel, reviewed: tx.reviewed || null,
    simulated: tx.simulated ?? true,
  };
}

export function fromRecord(row) {
  return {
    id: row.id, merchant: row.merchant, category: row.category,
    amount: Number(row.amount), location: row.location,
    international: row.international, newDevice: row.new_device,
    velocity: row.velocity, suspiciousMerchant: row.suspicious_merchant,
    unusualHours: row.unusual_hours, timestamp: row.occurred_at,
    account: row.account_label, channel: row.channel,
    reviewed: row.reviewed, simulated: row.simulated,
  };
}

export async function loadWorkspace(userId) {
  const [transactionsResult, rulesResult] = await Promise.all([
    supabase.from(TABLE).select('*').eq('user_id', userId).order('occurred_at', { ascending: false }).limit(1000),
    supabase.from(RULES_TABLE).select('settings').eq('user_id', userId).maybeSingle(),
  ]);
  assertOk(transactionsResult);
  assertOk(rulesResult);
  let rows = transactionsResult.data || [];
  // First sign-in: generate synthetic records to make the dashboard useful.
  if (!rows.length) {
    const seedResult = await supabase.from(TABLE)
      .upsert(initialTransactions().map(tx => toRecord(userId, tx)), { onConflict: 'user_id,id' })
      .select('*');
    assertOk(seedResult);
    rows = seedResult.data || [];
  }
  return {
    transactions: rows.map(fromRecord),
    rules: { ...DEFAULT_RULES, ...(rulesResult.data?.settings || {}) },
  };
}

export async function addTransaction(userId, tx) {
  const result = await supabase.from(TABLE).insert(toRecord(userId, tx)).select('*').single();
  assertOk(result);
  return fromRecord(result.data);
}

export async function updateReview(userId, transactionId, reviewed) {
  const result = await supabase.from(TABLE).update({ reviewed })
    .eq('user_id', userId).eq('id', transactionId).select('id').single();
  assertOk(result);
}

export async function saveRules(userId, rules) {
  assertOk(await supabase.from(RULES_TABLE).upsert({ user_id: userId, settings: rules }, { onConflict: 'user_id' }));
}

export async function resetWorkspace(userId) {
  assertOk(await supabase.from(TABLE).delete().eq('user_id', userId));
  const resetRecords = initialTransactions();
  const result = await supabase.from(TABLE).insert(resetRecords.map(tx => toRecord(userId, tx))).select('*');
  assertOk(result);
  await saveRules(userId, DEFAULT_RULES);
  return (result.data || []).map(fromRecord);
}
