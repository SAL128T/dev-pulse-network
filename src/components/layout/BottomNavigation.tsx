
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Bell, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useChat } from '@/context/ChatContext';

const BottomNavigation: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { getUnreadCount } = useChat();
  
  const notificationCount = user ? unreadCount(user.id) : 0;
  const messageCount = user ? getUnreadCount(user.id) : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border">
      <div className="grid grid-cols-5 h-full">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={24} />
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
          <Bell size={24} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/chats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} relative`}>
          <MessageSquare size={24} />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {messageCount > 9 ? '9+' : messageCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
