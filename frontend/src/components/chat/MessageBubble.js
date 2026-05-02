import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  const [displayedText, setDisplayedText] = useState(message.isNew ? '' : message.content);

  useEffect(() => {
    if (!message.isNew || isUser) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.content.substring(0, i + 1));
      i += 2; // Speed up by taking 2 chars at a time
      if (i >= message.content.length) {
        setDisplayedText(message.content);
        clearInterval(interval);
      }
    }, 15); // Adjust speed here

    return () => clearInterval(interval);
  }, [message.isNew, message.content, isUser]);
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className="flex gap-4 max-w-[85%] sm:max-w-[75%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden p-0.5 border border-border/30">
            <img src="/logo.png" alt="LPU Logo" className="w-full h-full object-contain" />
          </div>
        )}
        
        <div 
          className={`
            px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed
            ${isUser 
              ? 'bg-primary text-white rounded-br-none shadow-md' 
              : 'bg-white text-text-dark rounded-bl-none shadow-sm border border-border/30'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-primary">
              <ReactMarkdown>{displayedText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
