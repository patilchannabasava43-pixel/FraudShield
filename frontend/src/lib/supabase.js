import { createClient } from '@supabase/supabase-js';

// This is the dedicated FraudShield project's PUBLIC browser configuration.
// The publishable key is not a database secret. Row Level Security protects
// user data. NEVER put a service_role or sb_secret_ key in frontend code.
const defaultUrl = 'https://lgpnfcocmfnhnsgeqbbu.supabase.co';
const defaultPublishableKey = 'sb_publishable_QnNrr2OBvbTrjI5dVG-kVQ_QJlXZTbN';

// Optional overrides for another environment/project (e.g. future deployment).
const url = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || defaultPublishableKey;

export const supabase = url && key ? createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;
export const supabaseConfigured = Boolean(supabase);