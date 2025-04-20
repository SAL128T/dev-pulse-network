
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/context/PostsContext';
import { useCommunity } from '@/context/CommunityContext';
import PostCard from '@/components/post/PostCard';
import { LogOut, Edit, Settings, Briefcase, Code, BookOpen } from 'lucide-react';
import DevButton from '@/components/ui/dev-button';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { userPosts } = usePosts();
  const { userCommunities } = useCommunity();
  const navigate = useNavigate();
  
  if (!user) {
    return null;
  }
  
  const posts = userPosts(user.id);
  const communities = userCommunities(user.id);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="dev-card mb-6 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <Link to="/profile/edit">
            <button className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80">
              <Edit size={18} />
            </button>
          </Link>
          <button className="p-2 bg-muted rounded-full text-foreground hover:bg-muted/80">
            <Settings size={18} />
          </button>
        </div>
        
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-muted">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl bg-primary/10 text-primary">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-xl font-bold mb-1">{user.username}</h1>
          {user.profession && (
            <div className="flex items-center text-muted-foreground mb-2">
              <Briefcase size={14} className="mr-1" />
              <span>{user.profession}</span>
            </div>
          )}
          
          {user.experience && (
            <div className="text-sm text-muted-foreground mb-4">
              {user.experience} of experience
            </div>
          )}
        </div>
        
        <div className="border-t border-border pt-4">
          {user.fieldOfStudy && (
            <div className="flex items-center mb-3">
              <BookOpen size={16} className="text-muted-foreground mr-2" />
              <span className="text-sm">Field: {user.fieldOfStudy}</span>
            </div>
          )}
          
          {user.skills && user.skills.length > 0 && (
            <div className="flex items-start mb-2">
              <Code size={16} className="text-muted-foreground mr-2 mt-1" />
              <div className="flex flex-wrap gap-1">
                {user.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-border mt-4 pt-4 flex justify-between">
          <div className="text-center flex-1">
            <div className="font-bold">{posts.length}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold">{communities.length}</div>
            <div className="text-xs text-muted-foreground">Communities</div>
          </div>
          <div className="text-center flex-1">
            <div className="font-bold">0</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
        </div>
      </div>
      
      {posts.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Your Posts</h2>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      ) : (
        <div className="dev-card text-center py-8 mb-6">
          <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
          <Link to="/">
            <DevButton>Create Your First Post</DevButton>
          </Link>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="text-destructive flex items-center justify-center mx-auto hover:underline"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
