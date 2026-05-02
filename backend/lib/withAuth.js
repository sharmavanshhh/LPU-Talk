/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Authentication Middleware
 *  Extracts and verifies the Supabase JWT from the Authorization header.
 *  Attaches `req.user` with the authenticated user object on success.
 * ═══════════════════════════════════════════════════════════════════════
 */

const { supabase } = require('./supabase');

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

    // Attach user to request for downstream route handlers
    req.user = user;
    next();
  } catch (err) {
    console.error('[AUTH ERROR]', err.message);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { withAuth };
