
import React from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

interface PostHeaderProps {
  userId: string;
  username: string;
  userProfilePic?: string;
  createdAt: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  userId,
  username,
  userProfilePic,
  createdAt
}) => {
  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center">
        <Link to={`/user/${userId}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
            {userProfilePic ? (
              <img
                src={userProfilePic}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div className="ml-3">
          <Link to={`/user/${userId}`} className="font-medium hover:underline">
            {username}
          </Link>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
      <button className="p-1 text-muted-foreground hover:text-foreground rounded-full">
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
};

export default PostHeader;
