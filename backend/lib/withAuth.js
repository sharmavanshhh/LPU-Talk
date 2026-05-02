/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Authentication Middleware
 *  Extracts and verifies the Supabase JWT from the Authorization header.
 *  Attaches `req.user` with the authenticated user object on success.
 * ═══════════════════════════════════════════════════════════════════════
 */

const { supabase, supabaseAdmin } = require('./supabase');

/**
 * Express middleware — protects routes behind Supabase auth.
 * Expects: Authorization: Bearer <supabase_jwt>
 */
async function withAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // SELF-HEALING: Ensure a profile exists for this user in the public.profiles table.
    // If the Supabase trigger failed to create a profile, we do it here.
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      await supabaseAdmin.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || ''
      });
    }

    // Attach user to request for downstream route handlers
    req.user = user;
    next();
  } catch (err) {
    console.error('[AUTH ERROR]', err.message);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { withAuth };
