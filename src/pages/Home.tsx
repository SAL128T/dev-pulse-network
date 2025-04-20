
import React, { useState } from 'react';
import { usePosts } from '@/context/PostsContext';
import PostCard from '@/components/post/PostCard';
import NewPostInput from '@/components/post/NewPostInput';
import { Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { posts } = usePosts();
  const [filter, setFilter] = useState<'all' | 'trending'>('all');
  
  const filteredPosts = filter === 'trending'
    ? [...posts].sort((a, b) => b.likes - a.likes)
    : [...posts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
          DevPulse
        </h1>
        
        <div className="flex items-center">
          <button 
            className={`px-3 py-1 text-sm rounded-l-md transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setFilter('all')}
          >
            Recent
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-r-md transition-colors ${
              filter === 'trending' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setFilter('trending')}
          >
            Trending
          </button>
        </div>
      </div>
      
      <NewPostInput />
      
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
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
