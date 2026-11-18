import test from 'node:test';
import assert from 'node:assert/strict';
import { signInOrCreate } from '../frontend/src/lib/credentials.js';

const invalid = { code: 'invalid_credentials', message: 'Invalid login credentials' };

test('existing user signs in with email and password', async () => {
  let signupCalled = false;
  const auth = {
    signInWithPassword: async values => {
      assert.equal(values.email, 'user@example.com');
      return { data: { session: { access_token: 'test' } }, error: null };
    },
    signUp: async () => { signupCalled = true; },
  };
  const result = await signInOrCreate(auth, ' user@example.com ', 'password123');
  assert.equal(result.created, false);
  assert.equal(signupCalled, false);
});

test('new user is created and signed in without a confirmation step when Supabase allows it', async () => {
  const auth = {
    signInWithPassword: async () => ({ data: null, error: invalid }),
    signUp: async () => ({ data: { session: { access_token: 'new' } }, error: null }),
  };
  assert.equal((await signInOrCreate(auth, 'new@example.com', 'password123')).created, true);
});

test('shows actionable error if Supabase still requires email confirmation', async () => {
  const auth = {
    signInWithPassword: async () => ({ error: invalid }),
    signUp: async () => ({ data: { user: { id: 'pending' }, session: null }, error: null }),
  };
  await assert.rejects(signInOrCreate(auth, 'new@example.com', 'password123'), /turn OFF Confirm email/);
});

test('existing unconfirmed users do not get duplicate registration attempts', async () => {
  let signupCalled = false;
  const auth = {
    signInWithPassword: async () => ({ error: { code: 'email_not_confirmed', message: 'Email not confirmed' } }),
    signUp: async () => { signupCalled = true; },
  };
  await assert.rejects(signInOrCreate(auth, 'pending@example.com', 'password123'), /account is not confirmed/);
  assert.equal(signupCalled, false);
});

test('incorrect password of existing account is not described as a new account', async () => {
  const auth = {
    signInWithPassword: async () => ({ error: invalid }),
    signUp: async () => ({ error: { code: 'user_already_exists', message: 'User already registered' } }),
  };
  await assert.rejects(signInOrCreate(auth, 'existing@example.com', 'wrongpassword'), /correct password/);
});

test('network and rate-limit errors never start an automatic registration', async () => {
  let signupCalled = false;
  const rateLimit = { code: 'over_request_rate_limit', message: 'Rate limit exceeded' };
  const auth = {
    signInWithPassword: async () => ({ error: rateLimit }),
    signUp: async () => { signupCalled = true; },
  };
  await assert.rejects(signInOrCreate(auth, 'user@example.com', 'password123'), /Rate limit exceeded/);
  assert.equal(signupCalled, false);
});
