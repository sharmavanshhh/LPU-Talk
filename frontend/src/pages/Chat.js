import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChatSession } from '../hooks/useChatSession';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Chat = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { messages, loading: chatLoading, error, loadSession, sendMessage } = useChatSession(sessionId);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // We no longer redirect to '/' since Chat IS the landing page.
    // Unauthenticated state is handled by ChatInput.
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user && sessionId) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, sessionId, navigate]);

  useEffect(() => {
    if (sessionId && user) {
      loadSession(sessionId, location.state?.skipLoading);
    }
  }, [sessionId, loadSession, location.state, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    setIsTyping(true);
    const newSessionId = await sendMessage(sessionId, text);
    setIsTyping(false);
    
    // If a new session was created, update URL without reloading
    if (!sessionId && newSessionId) {
      navigate(`/chat/${newSessionId}`, { replace: true, state: { skipLoading: true } });
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && user && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {user && <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex items-center">
          {user && (
            <button 
              className="md:hidden p-4 text-text-dark shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          )}
          <div className="flex-1">
            <Header />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full" ref={scrollRef}>
          <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
            {(chatLoading && sessionId && user) ? (
              <LoadingSpinner />
            ) : (error && user) ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
                {error}
              </div>
            ) : (messages.length === 0 || !user) ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col pb-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            )}
          </div>
        </main>

        <ChatInput onSend={handleSend} disabled={isTyping} user={user} />
      </div>
    </div>
  );
};
