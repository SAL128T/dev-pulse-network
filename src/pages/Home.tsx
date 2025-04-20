
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePosts } from '@/context/PostsContext';
import PostCard from '@/components/post/PostCard';
import NewPostInput from '@/components/post/NewPostInput';

const Home: React.FC = () => {
  const { posts } = usePosts();
  const location = useLocation();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  
  // Check if we have a skill search query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const skill = searchParams.get('skill');
    
    if (skill) {
      setActiveSkill(skill);
      
      // Try to get stored search results
      const storedResults = localStorage.getItem('skillSearchResults');
      if (storedResults) {
        const { posts: postIds } = JSON.parse(storedResults);
        
        // Filter posts based on stored IDs
        const skillFilteredPosts = posts.filter(post => postIds.includes(post.id));
        setFilteredPosts(skillFilteredPosts);
      } else {
        // If no stored results, filter posts that contain the skill name
        const skillFilteredPosts = posts.filter(post => 
          post.content.toLowerCase().includes(skill.toLowerCase())
        );
        setFilteredPosts(skillFilteredPosts);
      }
    } else {
      setActiveSkill(null);
      setFilteredPosts(posts);
    }
  }, [location.search, posts]);
  
  // Sort posts by creation date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const clearSkillFilter = () => {
    setActiveSkill(null);
    setFilteredPosts(posts);
    localStorage.removeItem('skillSearchResults');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
          DevCollab
        </h1>
      </div>
      
      {activeSkill && (
        <div className="mb-4 flex justify-between items-center bg-muted/50 p-3 rounded-md">
          <div>
            <span className="text-muted-foreground">Showing posts related to: </span>
            <span className="font-medium">{activeSkill}</span>
          </div>
          <button 
            className="text-sm text-primary hover:underline"
            onClick={clearSkillFilter}
          >
            Clear filter
          </button>
        </div>
      )}
      
      <NewPostInput />
      
      {sortedPosts.length > 0 ? (
        sortedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="dev-card text-center py-8">
          <p className="text-muted-foreground">
            {activeSkill 
              ? `No posts found related to ${activeSkill}`
              : 'No posts yet. Be the first to share something!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
