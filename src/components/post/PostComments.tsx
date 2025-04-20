
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/context/PostsContext';

interface PostCommentsProps {
  comments: Comment[];
  postId: string;
}

const PostComments: React.FC<PostCommentsProps> = ({ comments, postId }) => {
  if (comments.length === 0) return null;

  return (
    <div className="mt-3 pt-2 border-t border-border">
      <h4 className="text-xs font-medium text-muted-foreground mb-2">
        Comments ({comments.length})
      </h4>
      
      {comments.slice(0, 2).map((comment) => (
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
      
      {comments.length > 2 && (
        <Link to={`/post/${postId}`} className="text-xs text-primary hover:underline">
          View all {comments.length} comments
        </Link>
      )}
    </div>
  );
};

export default PostComments;
