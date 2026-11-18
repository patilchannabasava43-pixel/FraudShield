import React, { useState } from 'react';
import { ShieldCheck, Mail, LockKeyhole, ArrowRight, LoaderCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { signInOrCreate } from './lib/credentials';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await signInOrCreate(supabase.auth, email, password);
      if (result.created) setMessage('Demo account created. Opening your dashboard...');
      // App.jsx listens for the Supabase signed-in event and opens the dashboard.
    } catch (cause) {
      setError(cause?.message || 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page"><div className="auth-card">
    <div className="auth-logo"><ShieldCheck size={26}/></div>
    <div className="eyebrow">FRAUDSHIELD AI · SECURE WORKSPACE</div>
    <h1>Welcome to FraudShield</h1>
    <p>Enter your email and password to sign in. First time here? Your demo account will be created automatically.</p>
    <form onSubmit={submit}>
      <label htmlFor="auth-email"><Mail size={15}/> Email address</label>
      <input id="auth-email" autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <label htmlFor="auth-password"><LockKeyhole size={15}/> Password</label>
      <input id="auth-password" autoComplete="current-password" type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
      {error && <div className="auth-error" role="alert">{error}</div>}
      {message && <div className="auth-success" role="status">{message}</div>}
      <button className="button primary auth-submit" disabled={busy} type="submit">
        {busy ? <LoaderCircle size={17} className="auth-spinner"/> : <ArrowRight size={17}/>}
        {busy ? 'Signing in...' : 'Continue'}
      </button>
    </form>
    <div className="auth-switch">One form for sign-in and new demo accounts. No extra details needed.</div>
    <div className="auth-note">Academic demonstration only. Do not enter real banking credentials or financial records.</div>
  </div></div>;
}
