/**
 * Sign in existing users, or create a new demo account with the same two fields.
 * No email-verification bypass happens client-side: instant registration requires
 * Supabase Auth > Sign In / Providers > Email > Confirm email to be disabled.
 */
export async function signInOrCreate(auth, email, password) {
  const credentials = { email: email.trim(), password };
  const { data: signedIn, error: signInError } = await auth.signInWithPassword(credentials);
  if (!signInError) return { created: false, session: signedIn?.session };

  const code = signInError.code || '';
  const message = signInError.message || '';
  if (code === 'email_not_confirmed' || /email not confirmed|email not verified/i.test(message)) {
    throw new Error('This account is not confirmed yet. The project owner must disable Confirm email in Supabase Authentication > Sign In / Providers > Email. If this account was created earlier, it may need to be recreated.');
  }

  // Only an invalid-credentials response can mean that the account is new.
  // Do not register accounts after rate-limit, connection, or other auth errors.
  if (code !== 'invalid_credentials' && !/invalid login credentials/i.test(message)) {
    throw signInError;
  }

  const { data: registered, error: signUpError } = await auth.signUp(credentials);
  if (signUpError) {
    const signUpMessage = signUpError.message || '';
    if (signUpError.code === 'user_already_exists' || /already registered|already exists/i.test(signUpMessage)) {
      throw new Error('An account already uses this email. Please enter its correct password.');
    }
    throw signUpError;
  }

  if (!registered?.session) {
    throw new Error('Supabase still requires email confirmation. In your Supabase project, turn OFF Confirm email under Authentication > Sign In / Providers > Email, then try again.');
  }

  return { created: true, session: registered.session };
}
