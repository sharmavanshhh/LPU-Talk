/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Chat Sessions Routes
 *  GET  /api/chat/sessions       → List all sessions for the user
 *  POST /api/chat/sessions       → Create a new chat session
 *  GET  /api/chat/sessions/:id   → Get all messages in a session
 *  DELETE /api/chat/sessions/:id → Delete a session and its messages
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { withAuth } = require('../lib/withAuth');

// ─── GET /api/chat/sessions — List all sessions ──────────────────────
router.get('/', withAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return res.json({ sessions: data || [] });
  } catch (err) {
    console.error('[SESSIONS LIST ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// ─── POST /api/chat/sessions — Create a new session ──────────────────
router.post('/', withAuth, async (req, res) => {
  try {
    const { title } = req.body;

    const { data, error } = await supabaseAdmin
      .from('chat_sessions')
      .insert({
        user_id: req.user.id,
        title: title || 'New Chat',
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ session: data });
  } catch (err) {
    console.error('[SESSION CREATE ERROR]', err);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// ─── GET /api/chat/sessions/:id — Get messages in a session ──────────
router.get('/:id', withAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('chat_sessions')
      .select('id, title, created_at')
      .eq('id', sessionId)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Fetch all messages in this session
    const { data: messages, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    return res.json({ session, messages: messages || [] });
  } catch (err) {
    console.error('[SESSION DETAIL ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// ─── DELETE /api/chat/sessions/:id — Delete a session ────────────────
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Verify ownership before deleting
    const { data: session, error: checkError } = await supabaseAdmin
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', req.user.id)
      .single();

    if (checkError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Messages are cascade-deleted by FK constraint
    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;

    return res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('[SESSION DELETE ERROR]', err);
    return res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
