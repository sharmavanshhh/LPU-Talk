import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/chat" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 overflow-hidden p-2">
          <img src="/logo.png" alt="LPU Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          LPU Talk
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-lg mx-auto">
          Your intelligent guide to everything at Lovely Professional University.
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-border/30">
        <h2 className="text-xl font-bold text-text-dark mb-6">Sign in to start chatting</h2>
        <GoogleLoginButton />
        
        <p className="mt-6 text-sm text-text-muted">
          By signing in, you agree that this AI only answers questions related to LPU.
        </p>
      </div>
      
      <div className="mt-12 text-sm text-text-muted/60">
        Strictly for LPU-related queries • Powered by Gemini AI
      </div>
    </div>
  );
};
