
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useChat, Message } from '@/context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Send, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ChatDetail: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChat, sendMessage, markChatAsRead } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  if (!user || !chatId) {
    return null;
  }
  
  const chat = getChat(chatId);
  
  if (!chat) {
    navigate('/chats');
    return null;
  }
  
  useEffect(() => {
    // Mark all messages as read when the chat is opened
    markChatAsRead(chatId, user.id);
    
    // Scroll to bottom of message list
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatId, markChatAsRead, user.id, chat?.messages.length]);
  
  // Get the partner in a 1:1 chat
  const getChatPartnerInfo = () => {
    const partnerId = chat.participants.find(id => id !== user.id);
    
    // Mock user data - in a real app this would come from a user context or API
    const mockUsers: Record<string, { username: string; profilePic?: string }> = {
      '2': { username: 'sarahjones', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
      '3': { username: 'mikesmith', profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' },
      '4': { username: 'emilywong', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
      '5': { username: 'alexchen', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
      '6': { username: 'davidlee', profilePic: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1' },
    };
    
    return mockUsers[partnerId as string] || { username: 'Unknown User' };
  };
  
  const partner = getChatPartnerInfo();
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(chatId, {
        senderId: user.id,
        content: newMessage.trim(),
      });
      setNewMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-devpulse-background pb-16">
      {/* Chat header */}
      <div className="bg-card border-b border-border p-4 flex items-center sticky top-0 z-10">
        <button 
          className="mr-3 text-foreground hover:text-primary"
          onClick={() => navigate('/chats')}
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted mr-3">
            {partner.profilePic ? (
              <img
                src={partner.profilePic}
                alt={partner.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                {partner.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-medium">{partner.username}</h2>
            <p className="text-xs text-muted-foreground">
              Last active {formatDistanceToNow(new Date(chat.lastActivity), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message: Message) => {
          const isUserMessage = message.senderId === user.id;
          
          return (
            <div 
              key={message.id}
              className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] p-3 rounded-lg ${
                  isUserMessage 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-card text-card-foreground rounded-bl-none'
                }`}
              >
                {message.content}
                {message.imageUrl && (
                  <img 
                    src={message.imageUrl} 
                    alt="Shared" 
                    className="mt-2 rounded-md max-w-full"
                  />
                )}
                <div className={`text-xs mt-1 ${isUserMessage ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-border bg-card sticky bottom-16">
        <div className="flex">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none"
            rows={1}
          />
          <div className="flex ml-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
            >
              <Image size={20} />
            </Button>
            <Button 
              variant="primary" 
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
