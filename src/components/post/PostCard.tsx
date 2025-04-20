
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { usePosts, type Post } from '@/context/PostsContext';
import { useNotification } from '@/context/NotificationContext';
import DevButton from '@/components/ui/dev-button';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import PostComments from './PostComments';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { likePost, addComment } = usePosts();
  const { addNotification } = useNotification();
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!user) return;
    
    setIsLiked(!isLiked);
    likePost(post.id, isLiked);
    
    if (!isLiked && user.id !== post.userId) {
      addNotification({
        userId: post.userId,
        type: 'like',
        fromUserId: user.id,
        fromUsername: user.username,
        entityId: post.id,
        content: `liked your post`,
      });
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

  const formatContent = (content: string) => {
    return content.replace(/\n/g, '<br>');
  };

  return (
    <div className="dev-card mb-4 animate-fade-in">
      <PostHeader
        userId={post.userId}
        username={post.username}
        userProfilePic={post.userProfilePic}
        createdAt={post.createdAt}
      />
      
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
      
      <PostActions
        likes={post.likes}
        commentsCount={post.comments.length}
        isLiked={isLiked}
        onLikeClick={handleLike}
        onCommentClick={() => setShowCommentInput(!showCommentInput)}
      />
      
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
      
      <PostComments comments={post.comments} postId={post.id} />
    </div>
  );
};

export default PostCard;
