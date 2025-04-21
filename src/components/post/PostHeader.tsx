
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface PostHeaderProps {
  post: {
    id: string;
    user: {
      id: string;
      name: string;
      username: string;
      profilePicture: string;
    };
    createdAt: string;
  };
  onDeletePost?: (postId: string) => void;
  currentUserId: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onDeletePost, currentUserId }) => {
  const isCurrentUserPost = post.user.id === currentUserId;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${post.user.id}`}>
          <Avatar className="h-10 w-10">
            {post.user.profilePicture ? (
              <AvatarImage src={post.user.profilePicture} alt={post.user.name} />
            ) : (
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
        <div>
          <Link to={`/profile/${post.user.id}`} className="font-medium hover:underline">
            {post.user.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {isCurrentUserPost && onDeletePost && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={() => onDeletePost(post.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default PostHeader;
