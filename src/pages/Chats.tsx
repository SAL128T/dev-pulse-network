
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { Search, UserPlus, MessageSquare } from 'lucide-react';

const Chats: React.FC = () => {
  const { user } = useAuth();
  const { userChats } = useChat();
  
  if (!user) {
    return null;
  }
  
  const chats = userChats(user.id);

  // Get the partner in a 1:1 chat
  const getChatPartnerInfo = (chat: any) => {
    const partnerId = chat.participants.find((id: string) => id !== user.id);
    
    // In a real app, you would fetch the partner info from a users context or API
    // This is just mocked data for our demo
    const mockUsers: Record<string, { username: string; profilePic?: string }> = {
      '2': { username: 'sarahjones', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
      '3': { username: 'mikesmith', profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' },
      '4': { username: 'emilywong', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
      '5': { username: 'alexchen', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
      '6': { username: 'davidlee', profilePic: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1' },
    };
    
    return mockUsers[partnerId] || { username: 'Unknown User' };
  };

  // Get last message in a chat
  const getLastMessage = (chat: any) => {
    if (chat.messages.length === 0) return null;
    return chat.messages[chat.messages.length - 1];
  };

  // Count unread messages in a chat
  const getUnreadCount = (chat: any) => {
    return chat.messages.filter(
      (msg: any) => msg.senderId !== user.id && !msg.read
    ).length;
  };

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        
        <div className="flex gap-2">
          <Link to="/search/users">
            <button className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80">
              <UserPlus size={18} />
            </button>
          </Link>
          <Link to="/chats/search">
            <button className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80">
              <Search size={18} />
            </button>
          </Link>
        </div>
      </div>
      
      <div className="space-y-2">
        {chats.length > 0 ? (
          chats.map(chat => {
            const partnerInfo = getChatPartnerInfo(chat);
            const lastMessage = getLastMessage(chat);
            const unreadCount = getUnreadCount(chat);
            
            return (
              <Link to={`/chat/${chat.id}`} key={chat.id}>
                <div className={`dev-card p-3 flex items-center ${
                  unreadCount > 0 ? 'border-l-4 border-l-primary' : ''
                }`}>
                  <div className="relative mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      {partnerInfo.profilePic ? (
                        <img
                          src={partnerInfo.profilePic}
                          alt={partnerInfo.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          {partnerInfo.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{partnerInfo.username}</h3>
                      {lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    {lastMessage && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        {lastMessage.senderId === user.id && (
                          <span className="mr-1">You: </span>
                        )}
                        {lastMessage.content.length > 30
                          ? `${lastMessage.content.substring(0, 30)}...`
                          : lastMessage.content}
                        {lastMessage.imageUrl && (
                          <span className="ml-1 text-xs bg-muted px-1 rounded">
                            [Image]
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="dev-card text-center py-12">
            <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a conversation with other developers in the community
            </p>
            <Link to="/search/users">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                Find People
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
