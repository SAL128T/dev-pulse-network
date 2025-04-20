
import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface PostActionsProps {
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  onLikeClick: () => void;
  onCommentClick: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  likes,
  commentsCount,
  isLiked,
  onLikeClick,
  onCommentClick,
}) => {
  return (
    <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t border-border">
      <button
        className={`flex items-center p-2 transition-colors ${isLiked ? 'text-primary' : 'hover:text-primary'}`}
        onClick={onLikeClick}
      >
        <Heart size={18} className="mr-1" />
        <span>{likes}</span>
      </button>
      
      <button
        className="flex items-center p-2 hover:text-primary transition-colors"
        onClick={onCommentClick}
      >
        <MessageSquare size={18} className="mr-1" />
        <span>{commentsCount}</span>
      </button>
      
      <button className="flex items-center p-2 hover:text-primary transition-colors">
        <Share2 size={18} />
      </button>
    </div>
  );
};

export default PostActions;
