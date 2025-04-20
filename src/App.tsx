
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { PostsProvider } from "@/context/PostsContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ChatProvider } from "@/context/ChatContext";
import { CommunityProvider } from "@/context/CommunityContext";

// Auth pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import SetupProfile from "@/pages/auth/SetupProfile";

// Main app pages
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Notifications from "@/pages/Notifications";
import Chats from "@/pages/Chats";
import ChatDetail from "@/pages/ChatDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

// Layout
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-devpulse-background">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  return <>{children}</>;
};

// Auth route component (redirects to home if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-devpulse-background">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PostsProvider>
            <NotificationProvider>
              <ChatProvider>
                <CommunityProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </CommunityProvider>
              </ChatProvider>
            </NotificationProvider>
          </PostsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/auth/register" element={<AuthRoute><Register /></AuthRoute>} />
        
        {/* Profile setup route */}
        <Route 
          path="/setup-profile" 
          element={
            <ProtectedRoute>
              <SetupProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Main app routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Chat detail route - separate from AppLayout to use full screen */}
        <Route 
          path="/chat/:chatId" 
          element={
            <ProtectedRoute>
              <ChatDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Default route to login screen */}
        <Route path="/" element={<Navigate to="/auth/login" />} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
