// Server-side Supabase access for the payment endpoints.
// Files prefixed with "_" in /api are shared modules, not deployed as functions.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cjfasrvjmhkvrmcgrrnw.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Privileged client. Bypasses RLS, so it is the only thing that can write
 * pro_users — which is exactly why the client is never given this key.
 */
export function getServiceClient() {
  if (!SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Resolve the caller from their Supabase JWT.
 *
 * Every payment endpoint must know *which* account it is acting for, and that
 * must come from a verified token rather than a user id in the request body —
 * otherwise anyone could buy Pro for, or grant Pro to, another account.
 *
 * @returns {Promise<{id: string, email: string|undefined}>}
 * @throws if the header is missing or the token does not validate
 */
export async function getUserFromRequest(req) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) throw new Error('Missing bearer token');

  // Validating with the anon key is enough: getUser() checks the token's
  // signature against the project, and the service role is not needed to read
  // an identity. Falls back to the service key only if no anon key is set.
  const key = ANON_KEY || SERVICE_ROLE_KEY;
  if (!key) throw new Error('No Supabase key configured');

  const supabase = createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) throw new Error('Invalid or expired session');
  return { id: data.user.id, email: data.user.email };
}

/** Small helper so every endpoint reports failures the same way. */
export function fail(res, status, message) {
  res.status(status).json({ error: message });
}
