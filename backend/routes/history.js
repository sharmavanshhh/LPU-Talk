/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Chat History Route
 *  GET /api/chat/history
 *  Returns all messages across all sessions for the authenticated user.
 *  Optional query param: ?sessionId=<uuid> to filter by session.
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { withAuth } = require('../lib/withAuth');

// ─── GET /api/chat/history ────────────────────────────────────────────
router.get('/', withAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.query;

    let query = supabaseAdmin
      .from('messages')
      .select('id, session_id, role, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    // Optionally filter by session
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({ messages: data || [] });
  } catch (err) {
    console.error('[HISTORY ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
