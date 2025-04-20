
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Message = {
  id: string;
  senderId: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  read: boolean;
};

export type Chat = {
  id: string;
  participants: string[];
  messages: Message[];
  lastActivity: string;
};

type ChatContextType = {
  chats: Chat[];
  userChats: (userId: string) => Chat[];
  getChat: (chatId: string) => Chat | undefined;
  getChatWithUser: (userId1: string, userId2: string) => Chat | undefined;
  sendMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  createChat: (participants: string[]) => Chat;
  markChatAsRead: (chatId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample user IDs:
// 1: Current user (johndoe)
// 2: sarahjones
// 3: mikesmith
// 4: emilywong
// 5: alexchen
// 6: davidlee

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: ['1', '2'],
    messages: [
      {
        id: 'm1',
        senderId: '2',
        content: 'Hi John! I saw your post about React hooks. Very interesting!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
      {
        id: 'm2',
        senderId: '1',
        content: 'Thanks Sarah! I\'ve been experimenting with custom hooks lately.',
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        read: true,
      },
      {
        id: 'm3',
        senderId: '2',
        content: 'Would love to collaborate on a project sometime. Are you available for freelance work?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
    ],
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'chat2',
    participants: ['1', '3'],
    messages: [
      {
        id: 'm4',
        senderId: '3',
        content: 'Hey John, do you have experience with GraphQL?',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
      {
        id: 'm5',
        senderId: '1',
        content: 'Yes, I\'ve used it in a couple of projects. Need help with something?',
        timestamp: new Date(Date.now() - 169200000).toISOString(),
        read: true,
      },
      {
        id: 'm6',
        senderId: '3',
        content: 'I\'m having trouble with nested queries. Could you take a look at my code?',
        imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
        timestamp: new Date(Date.now() - 165600000).toISOString(),
        read: true,
      },
      {
        id: 'm7',
        senderId: '1',
        content: 'Sure, send over your repo and I\'ll check it out tomorrow.',
        timestamp: new Date(Date.now() - 162000000).toISOString(),
        read: true,
      },
    ],
    lastActivity: new Date(Date.now() - 162000000).toISOString(),
  },
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Load chats from localStorage or use mock data
    const storedChats = localStorage.getItem('devpulse_chats');
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    } else {
      setChats(MOCK_CHATS);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devpulse_chats', JSON.stringify(chats));
  }, [chats]);

  const userChats = (userId: string) => {
    return chats
      .filter(chat => chat.participants.includes(userId))
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  };

  const getChat = (chatId: string) => {
    return chats.find(chat => chat.id === chatId);
  };

  const getChatWithUser = (userId1: string, userId2: string) => {
    return chats.find(chat => 
      chat.participants.includes(userId1) && 
      chat.participants.includes(userId2) && 
      chat.participants.length === 2
    );
  };

  const sendMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChats(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastActivity: newMessage.timestamp,
          };
        }
        return chat;
      })
    );
  };

  const createChat = (participants: string[]) => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants,
      messages: [],
      lastActivity: new Date().toISOString(),
    };

    setChats(prev => [...prev, newChat]);
    return newChat;
  };

  const markChatAsRead = (chatId: string, userId: string) => {
    setChats(prev =>
      prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map(message => {
              if (message.senderId !== userId && !message.read) {
                return { ...message, read: true };
              }
              return message;
            }),
          };
        }
        return chat;
      })
    );
  };

  const getUnreadCount = (userId: string) => {
    return chats.reduce((count, chat) => {
      if (chat.participants.includes(userId)) {
        const unreadMessages = chat.messages.filter(
          message => message.senderId !== userId && !message.read
        );
        return count + unreadMessages.length;
      }
      return count;
    }, 0);
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        userChats,
        getChat,
        getChatWithUser,
        sendMessage,
        createChat,
        markChatAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
