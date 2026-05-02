import React, { useState } from 'react';
import { Send, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ChatInput = ({ onSend, disabled, user }) => {
  const [text, setText] = useState('');
  const { signInWithGoogle } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled && user) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-bg-main border-t border-border/50">
      <div className="max-w-4xl mx-auto relative">
        {!user ? (
          <div className="flex flex-col items-center justify-center bg-white text-center">
            <p className="text-sm text-text-muted max-w-3xl">Join LPU Talk to ask questions, save your chat history, and get personalized assistance.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about LPU..."
              disabled={disabled}
              className="w-full bg-white border border-border/60 rounded px-4 py-3 pr-14 resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-primary transition-colors max-h-32 min-h-[52px]"
              rows={1}
            />
            <button
              type="submit"
              disabled={!text.trim() || disabled}
              className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
      {user && (
        <div className="text-center mt-3 text-xs text-text-muted">
          LPU Talk can make mistakes. Consider verifying important information.
        </div>
      )}
    </div>
  );
};
