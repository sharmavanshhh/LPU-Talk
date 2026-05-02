/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Auth Routes
 *  GET /api/auth/me      → Get current user profile
 *  POST /api/auth/logout → Clear session (client-side driven)
 *
 *  Note: Actual OAuth flow (Google sign-in, token exchange) is handled
 *  entirely by Supabase client SDK on the frontend. These routes only
 *  provide server-side user info and session validation.
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { withAuth } = require('../lib/withAuth');

// ─── GET /api/auth/me — Get current user profile ─────────────────────
router.get('/me', withAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, avatar_url, created_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.json({ user: profile });
  } catch (err) {
    console.error('[AUTH ME ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
