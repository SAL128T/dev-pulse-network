
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-devpulse-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-foreground">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should be handled by our protected routes, but this is a fallback
    window.location.href = '/auth/login';
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-devpulse-background">
      <main className="flex-1 pb-16 pt-2">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
