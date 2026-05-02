/**
 * ═══════════════════════════════════════════════════════════════════════
 *  LPU Talk — Core Chat Route
 *  POST /api/chat
 *  Receives a user message, fetches context from chat history,
 *  calls Gemini AI, saves both messages to Supabase, returns reply.
 * ═══════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { getLPUResponse, isLikelyLPUQuery } = require('../lib/gemini');
const { withAuth } = require('../lib/withAuth');

// ─── POST /api/chat ───────────────────────────────────────────────────
router.post('/', withAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    // ── Validate input ──────────────────────────────────────────────
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message must be under 1000 characters' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // ── Verify session belongs to user ──────────────────────────────
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // ── Secondary topic filter (saves Gemini calls on obvious spam) ─
    if (!isLikelyLPUQuery(message)) {
      const offTopicReply = 'I can only assist with LPU-related questions. Please ask me something about Lovely Professional University!';

      // Save both messages even for off-topic queries
      await supabaseAdmin.from('messages').insert([
        { session_id: sessionId, user_id: userId, role: 'user', content: message.trim() },
        { session_id: sessionId, user_id: userId, role: 'assistant', content: offTopicReply },
      ]);

      // Update session title if this is the first message
      await updateSessionTitle(sessionId, message.trim());

      return res.json({ reply: offTopicReply, sessionId });
    }

    // ── Fetch last 10 messages for context ──────────────────────────
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Convert to Gemini's expected format
    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // ── Call Gemini ─────────────────────────────────────────────────
    const reply = await getLPUResponse(message.trim(), chatHistory);

    // ── Save messages to DB ─────────────────────────────────────────
    await supabaseAdmin.from('messages').insert([
      { session_id: sessionId, user_id: userId, role: 'user', content: message.trim() },
      { session_id: sessionId, user_id: userId, role: 'assistant', content: reply },
    ]);

    // Update session title if this is the first message
    await updateSessionTitle(sessionId, message.trim());

    return res.json({ reply, sessionId });
  } catch (err) {
    console.error('[CHAT ERROR]', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * Updates the session title based on the first user message.
 * Only updates if the current title is the default 'New Chat'.
 */
async function updateSessionTitle(sessionId, userMessage) {
  try {
    const { data: session } = await supabaseAdmin
      .from('chat_sessions')
      .select('title')
      .eq('id', sessionId)
      .single();

    if (session && session.title === 'New Chat') {
      // Use first 50 chars of the first message as the title
      const title = userMessage.length > 50
        ? userMessage.substring(0, 50) + '...'
        : userMessage;

      await supabaseAdmin
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);
    }
  } catch (err) {
    // Non-critical — don't fail the chat if title update fails
    console.error('[TITLE UPDATE ERROR]', err.message);
  }
}

module.exports = router;
