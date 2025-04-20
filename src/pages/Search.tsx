
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, Code, X } from 'lucide-react';
import { useCommunity } from '@/context/CommunityContext';
import { usePosts } from '@/context/PostsContext';

type SearchType = 'people' | 'communities' | 'skills';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('people');
  const { communities } = useCommunity();
  const { posts } = usePosts();
  const navigate = useNavigate();
  
  // Mock user data for search results
  const mockUsers = [
    { id: '2', username: 'sarahjones', profession: 'Software Engineer', profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
    { id: '3', username: 'mikesmith', profession: 'Frontend Developer', profilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36' },
    { id: '4', username: 'emilywong', profession: 'Data Scientist', profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
    { id: '5', username: 'alexchen', profession: 'DevOps Engineer', profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { id: '6', username: 'davidlee', profession: 'Mobile Developer', profilePic: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1' },
  ];
  
  // Mock skills data
  const mockSkills = [
    { id: '1', name: 'React', count: 124 },
    { id: '2', name: 'JavaScript', count: 156 },
    { id: '3', name: 'Node.js', count: 89 },
    { id: '4', name: 'Python', count: 112 },
    { id: '5', name: 'TypeScript', count: 78 },
    { id: '6', name: 'Docker', count: 67 },
    { id: '7', name: 'AWS', count: 92 },
    { id: '8', name: 'GraphQL', count: 45 },
    { id: '9', name: 'Git', count: 134 },
  ];
  
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredSkills = mockSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to navigate to a user's profile
  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  // Function to find posts with a specific skill
  const handleSkillClick = (skillName: string) => {
    // Filter posts that might contain this skill in their content
    const postsWithSkill = posts.filter(post => 
      post.content.toLowerCase().includes(skillName.toLowerCase())
    );
    
    // Store the filtered posts in localStorage so they can be retrieved on the home page
    localStorage.setItem('skillSearchResults', JSON.stringify({
      skill: skillName,
      posts: postsWithSkill.map(p => p.id)
    }));
    
    // Navigate to home page with a query parameter
    navigate(`/?skill=${encodeURIComponent(skillName)}`);
  };

  return (
    <div className="container px-4 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <SearchIcon size={18} />
          </div>
          <input
            type="text"
            className="dev-input w-full pl-10"
            placeholder="Search developers, communities, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery('')}
            >
              <X size={18} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex border-b border-border mb-4">
        <button
          className={`flex-1 flex items-center justify-center py-2 ${
            activeTab === 'people' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('people')}
        >
          <Users size={16} className="mr-1" />
          <span>People</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center py-2 ${
            activeTab === 'communities' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('communities')}
        >
          <Users size={16} className="mr-1" />
          <span>Communities</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center py-2 ${
            activeTab === 'skills' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('skills')}
        >
          <Code size={16} className="mr-1" />
          <span>Skills</span>
        </button>
      </div>
      
      {activeTab === 'people' && (
        <div className="space-y-2">
          {searchQuery && filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No developers found for "{searchQuery}"
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Search for developers by name, username, or profession
            </div>
          ) : (
            filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="dev-card p-3 flex items-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted mr-3">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  <p className="text-sm text-muted-foreground">{user.profession}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {activeTab === 'communities' && (
        <div className="space-y-2">
          {searchQuery && filteredCommunities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No communities found for "{searchQuery}"
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Search for communities by name, description, or tags
            </div>
          ) : (
            filteredCommunities.map(community => (
              <Link to={`/community/${community.id}`} key={community.id}>
                <div className="dev-card p-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted mr-3">
                      {community.imageUrl ? (
                        <img
                          src={community.imageUrl}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          {community.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{community.name}</h3>
                        {community.isPrivate && (
                          <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{community.memberCount} members</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mt-2 line-clamp-2">
                    {community.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {community.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-muted px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {community.tags.length > 3 && (
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        +{community.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
      
      {activeTab === 'skills' && (
        <div className="grid grid-cols-2 gap-2">
          {searchQuery && filteredSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground col-span-2">
              No skills found for "{searchQuery}"
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground col-span-2">
              Search for skills to find developers with that expertise
            </div>
          ) : (
            filteredSkills.map(skill => (
              <div 
                key={skill.id} 
                className="dev-card p-3 cursor-pointer"
                onClick={() => handleSkillClick(skill.name)}
              >
                <h3 className="font-medium">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {skill.count} developers
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
