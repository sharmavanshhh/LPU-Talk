import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const EmptyState = () => {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-8 md:mt-0">
      <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center shadow-sm rounded-full mb-8 overflow-hidden p-4">
        <img src="/logo.png" alt="LPU Logo" className="w-full h-full object-contain" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">Welcome to LPU Talk</h2>
      <p className="text-text-muted max-w-2xl text-base sm:text-lg mb-8">
        Your intelligent AI guide exclusively for Lovely Professional University.
      </p>

      {!user && (
        <div className="flex flex-col items-center">
          <button 
            onClick={signInWithGoogle}
            className="flex items-center gap-2 bg-white border border-border hover:bg-bg-main text-text-dark px-6 py-2.5 rounded transition-colors shadow-sm font-medium"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      )}
      
      {user && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
          {[
            "What is the fee structure for B.Tech CSE?",
            "Tell me about placements at Mittal School of Business.",
            "How do I apply for hostel accommodation?",
            "What student clubs are available on campus?"
          ].map((q, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-border/40 text-sm text-text-dark shadow-sm hover:border-primary/40 transition-colors">
              "{q}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
