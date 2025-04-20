
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, MessageSquare, user as UserIcon, CheckCircle, Mail, Users, 
  Check, Bell, BellOff
} from 'lucide-react';
import DevButton from '@/components/ui/dev-button';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { userNotifications, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  
  if (!user) {
    return null;
  }
  
  const notifications = userNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'follow':
        navigate(`/user/${notification.fromUserId}`);
        break;
      case 'like':
      case 'comment':
        if (notification.entityId) {
          navigate(`/post/${notification.entityId}`);
        }
        break;
      case 'community_request':
      case 'community_approved':
        if (notification.entityId) {
          navigate(`/community/${notification.entityId}`);
        }
        break;
      case 'message':
        navigate(`/chat/${notification.fromUserId}`);
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-destructive" />;
      case 'comment':
        return <MessageSquare size={16} className="text-primary" />;
      case 'follow':
        return <UserIcon size={16} className="text-primary" />;
      case 'community_request':
        return <Users size={16} className="text-devpulse-secondary" />;
      case 'community_approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'message':
        return <Mail size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-primary" />;
    }
  };

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        
        {unreadCount > 0 && (
          <DevButton
            size="sm"
            variant="outline"
            leftIcon={<Check size={14} />}
            onClick={() => markAllAsRead(user.id)}
          >
            Mark all as read
          </DevButton>
        )}
      </div>
      
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`dev-card p-3 flex items-start cursor-pointer hover:bg-muted/50 transition-colors ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="mr-3 p-2 rounded-full bg-muted flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="mb-1">
                    <span className="font-medium">
                      {notification.fromUsername}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {notification.content}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                {notification.type === 'community_request' && (
                  <div className="flex gap-2 mt-2">
                    <DevButton size="sm">Accept</DevButton>
                    <DevButton size="sm" variant="outline">Decline</DevButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dev-card text-center py-12">
          <BellOff size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
          <p className="text-muted-foreground">
            When you receive notifications, they'll appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
