
import React from 'react';
import { usePosts } from '@/context/PostsContext';
import PostCard from '@/components/post/PostCard';
import NewPostInput from '@/components/post/NewPostInput';

const Home: React.FC = () => {
  const { posts } = usePosts();
  
  // Sort posts by creation date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
          DevCollab
        </h1>
      </div>
      
      <NewPostInput />
      
      {sortedPosts.length > 0 ? (
        sortedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="dev-card text-center py-8">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};

export default Home;
