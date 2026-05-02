import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-bg-main border-b border-border h-16 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex items-center justify-center">
          <img src="/logo.png" alt="LPU Logo" className="max-h-full max-w-full object-contain" />
        </div>
        <h1 className="font-extrabold text-primary text-xl tracking-tight">LPU Talk</h1>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email}</span>
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-light border border-primary flex items-center justify-center text-primary font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <button 
            onClick={signOut}
            className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary-light"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </header>
  );
};
