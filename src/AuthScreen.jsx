import React, { useState } from 'react';
import { ShieldCheck, Mail, LockKeyhole, ArrowRight, LoaderCircle } from 'lucide-react';
import { supabase } from './lib/supabase';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (authError) throw authError;
        if (!data.session) setMessage('Check your email for the verification link, then sign in.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }
    } catch (cause) {
      setError(cause.message || 'Authentication failed. Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="auth-page"><div className="auth-card">
    <div className="auth-logo"><ShieldCheck size={26}/></div>
    <div className="eyebrow">FRAUDSHIELD AI · SECURE WORKSPACE</div>
    <h1>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h1>
    <p>Sign in to securely save your synthetic transactions, review feedback and detection rules to Supabase.</p>
    <form onSubmit={submit}>
      <label htmlFor="auth-email"><Mail size={15}/> Email address</label>
      <input id="auth-email" autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <label htmlFor="auth-password"><LockKeyhole size={15}/> Password</label>
      <input id="auth-password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
      {error && <div className="auth-error" role="alert">{error}</div>}
      {message && <div className="auth-success" role="status">{message}</div>}
      <button className="button primary auth-submit" disabled={busy} type="submit">{busy ? <LoaderCircle size={17} className="auth-spinner"/> : <ArrowRight size={17}/>} {mode === 'login' ? 'Sign in' : 'Create account'}</button>
    </form>
    <div className="auth-switch">{mode === 'login' ? 'New to FraudShield?' : 'Already have an account?'} <button type="button" onClick={() => {setMode(mode === 'login' ? 'signup' : 'login');setError('');setMessage('')}}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
    <div className="auth-note">Prototype only. Do not enter real banking credentials or financial records.</div>
  </div></div>;
}
