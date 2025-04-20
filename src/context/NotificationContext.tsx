
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Notification = {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'community_request' | 'community_approved' | 'message';
  fromUserId: string;
  fromUsername: string;
  entityId?: string; // Post ID, Community ID, etc.
  content: string;
  read: boolean;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  userNotifications: (userId: string) => Notification[];
  unreadCount: (userId: string) => number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'follow',
    fromUserId: '2',
    fromUsername: 'sarahjones',
    content: 'started following you',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    userId: '1',
    type: 'like',
    fromUserId: '3',
    fromUsername: 'mikesmith',
    entityId: '101', // Post ID
    content: 'liked your post about React hooks',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    type: 'comment',
    fromUserId: '4',
    fromUsername: 'emilywong',
    entityId: '101', // Post ID
    content: 'commented on your post: "Great insight! Have you tried..."',
    read: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    type: 'community_request',
    fromUserId: '5',
    fromUsername: 'alexchen',
    entityId: 'frontend-dev', // Community ID
    content: 'requested to join your Frontend Developers community',
    read: false,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    userId: '1',
    type: 'message',
    fromUserId: '6',
    fromUsername: 'davidlee',
    content: 'sent you a message: "Hey, I saw your post about..."',
    read: true,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage or use mock data
    const storedNotifications = localStorage.getItem('devpulse_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devpulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const userNotifications = (userId: string) => {
    return notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const unreadCount = (userId: string) => {
    return notifications.filter(notification => notification.userId === userId && !notification.read).length;
  };

  const addNotification = (newNotification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = (userId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.userId === userId ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
