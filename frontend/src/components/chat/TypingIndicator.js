import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-6 w-full">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-1 overflow-hidden p-0.5 border border-border/30">
          <img src="/logo.png" alt="LPU Logo" className="w-full h-full object-contain" />
        </div>
        <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-none shadow-sm border border-border/30 flex items-center gap-1.5 h-[52px]">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
