import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';

export const useChatSession = (sessionId = null) => {
  const { fetchWithAuth } = useApi();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSession = useCallback(async (id, skipLoading = false) => {
    if (!id) {
      setMessages([]);
      return;
    }
    if (!skipLoading) setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/chat/sessions/${id}`);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Automatically clear messages if we navigate to a new chat
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
    }
  }, [sessionId]);

  const sendMessage = async (currentSessionId, messageText) => {
    setError(null);
    try {
      let activeSessionId = currentSessionId;
      // If no session exists, create one first
      if (!activeSessionId) {
        const sessionData = await fetchWithAuth('/chat/sessions', {
          method: 'POST',
          body: JSON.stringify({ title: messageText.substring(0, 50) })
        });
        activeSessionId = sessionData.session.id;
      }

      // Optimistically add user message
      const userMsg = { id: Date.now().toString(), role: 'user', content: messageText };
      setMessages(prev => [...prev, userMsg]);

      // Call API
      const replyData = await fetchWithAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: messageText, sessionId: activeSessionId })
      });

      // Add bot reply
      const botMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: replyData.reply, isNew: true };
      setMessages(prev => [...prev, botMsg]);

      return activeSessionId;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return { messages, setMessages, loading, error, loadSession, sendMessage };
};
