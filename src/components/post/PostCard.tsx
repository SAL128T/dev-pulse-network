
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Share2, MoreHorizontal, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { usePosts, type Post } from '@/context/PostsContext';
import { useNotification } from '@/context/NotificationContext';
import DevButton from '@/components/ui/dev-button';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { likePost, addComment } = usePosts();
  const { addNotification } = useNotification();
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!user) return;
    
    // Only add a like if user hasn't liked the post yet
    if (!hasLiked) {
      likePost(post.id);
      setHasLiked(true);
      
      // If the user likes someone else's post, add a notification
      if (user.id !== post.userId) {
        addNotification({
          userId: post.userId,
          type: 'like',
          fromUserId: user.id,
          fromUsername: user.username,
          entityId: post.id,
          content: `liked your post`,
        });
      }
    } else {
      // In a full implementation, we would remove the like here
      // For now, we just prevent adding more likes
      console.log("User has already liked this post");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !comment.trim()) return;
    
    addComment(post.id, {
      userId: user.id,
      username: user.username,
      userProfilePic: user.profilePicture,
      content: comment,
    });
    
    // If the user comments on someone else's post, add a notification
    if (user.id !== post.userId) {
      addNotification({
        userId: post.userId,
        type: 'comment',
        fromUserId: user.id,
        fromUsername: user.username,
        entityId: post.id,
        content: `commented on your post: "${comment.substring(0, 30)}${comment.length > 30 ? '...' : ''}"`,
      });
    }
    
    setComment('');
    setShowCommentInput(false);
  };

  // Format content text with code highlighting
  const formatContent = (content: string) => {
    const codeBlockRegex = /```([^`]+)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let formattedContent = content
      .replace(codeBlockRegex, '<pre class="bg-muted rounded-md p-3 my-2 font-mono text-sm overflow-x-auto">$1</pre>')
      .replace(inlineCodeRegex, '<code class="bg-muted rounded-md px-1 py-0.5 font-mono text-xs">$1</code>');
    
    // Convert newlines to <br> for normal text
    return formattedContent.replace(/\n/g, '<br>');
  };

  return (
    <div className="dev-card mb-4 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Link to={`/user/${post.userId}`}>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              {post.userProfilePic ? (
                <img
                  src={post.userProfilePic}
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                  {post.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <div className="ml-3">
            <Link to={`/user/${post.userId}`} className="font-medium hover:underline">
              {post.username}
            </Link>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <button className="p-1 text-muted-foreground hover:text-foreground rounded-full">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <div className="mb-3">
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </div>
      
      {post.imageUrl && (
        <div className="mb-3 rounded-md overflow-hidden bg-muted">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className="w-full h-auto"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t border-border">
        <button
          className={`flex items-center p-2 transition-colors ${hasLiked ? 'text-primary' : 'hover:text-primary'}`}
          onClick={handleLike}
        >
          <Heart size={18} className="mr-1" />
          <span>{post.likes}</span>
        </button>
        
        <button
          className="flex items-center p-2 hover:text-primary transition-colors"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <MessageSquare size={18} className="mr-1" />
          <span>{post.comments.length}</span>
        </button>
        
        <button className="flex items-center p-2 hover:text-primary transition-colors">
          <Code size={18} className="mr-1" />
          <span>Code</span>
        </button>
        
        <button className="flex items-center p-2 hover:text-primary transition-colors">
          <Share2 size={18} />
        </button>
      </div>
      
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="mt-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="dev-input w-full"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <DevButton type="submit" size="sm">
              Post
            </DevButton>
          </div>
        </form>
      )}
      
      {post.comments.length > 0 && (
        <div className="mt-3 pt-2 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Comments ({post.comments.length})
          </h4>
          
          {post.comments.slice(0, 2).map((comment) => (
            <div key={comment.id} className="flex items-start mb-2">
              <Link to={`/user/${comment.userId}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted mr-2">
                  {comment.userProfilePic ? (
                    <img
                      src={comment.userProfilePic}
                      alt={comment.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex-1">
                <div className="bg-muted rounded-md p-2">
                  <Link to={`/user/${comment.userId}`} className="font-medium text-xs hover:underline">
                    {comment.username}
                  </Link>
                  <div className="text-sm mt-1">{comment.content}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
          
          {post.comments.length > 2 && (
            <Link to={`/post/${post.id}`} className="text-xs text-primary hover:underline">
              View all {post.comments.length} comments
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
