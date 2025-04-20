
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Community = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  memberCount: number;
  imageUrl?: string;
  tags: string[];
  isPrivate: boolean;
  members: string[]; // Array of user IDs
  pendingRequests: string[]; // Array of user IDs
};

type CommunityContextType = {
  communities: Community[];
  userCommunities: (userId: string) => Community[];
  getCommunity: (id: string) => Community | undefined;
  createCommunity: (community: Omit<Community, 'id' | 'memberCount' | 'members' | 'pendingRequests'>) => void;
  joinCommunity: (communityId: string, userId: string) => void;
  requestToJoin: (communityId: string, userId: string) => void;
  approveRequest: (communityId: string, userId: string) => void;
  rejectRequest: (communityId: string, userId: string) => void;
  leaveCommunity: (communityId: string, userId: string) => void;
};

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'frontend-dev',
    name: 'Frontend Developers',
    description: 'A community for frontend developers to share knowledge, ask questions, and discuss trends.',
    creatorId: '2',
    creatorName: 'sarahjones',
    memberCount: 1254,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    tags: ['JavaScript', 'React', 'CSS', 'Web Development'],
    isPrivate: false,
    members: ['2', '3', '4'],
    pendingRequests: [],
  },
  {
    id: 'backend-dev',
    name: 'Backend Engineers',
    description: 'Discussion about server-side programming, databases, APIs, and system architecture.',
    creatorId: '3',
    creatorName: 'mikesmith',
    memberCount: 987,
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    tags: ['Node.js', 'Python', 'Java', 'Databases', 'APIs'],
    isPrivate: false,
    members: ['3', '5', '6'],
    pendingRequests: [],
  },
  {
    id: 'devops-team',
    name: 'DevOps Specialists',
    description: 'For professionals focusing on the integration of development and IT operations.',
    creatorId: '4',
    creatorName: 'emilywong',
    memberCount: 756,
    imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2',
    tags: ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'Infrastructure'],
    isPrivate: true,
    members: ['4', '5'],
    pendingRequests: [],
  },
  {
    id: 'mobile-dev',
    name: 'Mobile App Developers',
    description: 'Discussing all things related to mobile app development for iOS and Android.',
    creatorId: '5',
    creatorName: 'alexchen',
    memberCount: 1089,
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    tags: ['iOS', 'Android', 'Flutter', 'React Native', 'Swift', 'Kotlin'],
    isPrivate: false,
    members: ['2', '5', '6'],
    pendingRequests: [],
  },
  {
    id: 'ai-ml-experts',
    name: 'AI & Machine Learning',
    description: 'For developers working with artificial intelligence and machine learning technologies.',
    creatorId: '6',
    creatorName: 'davidlee',
    memberCount: 834,
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow', 'PyTorch'],
    isPrivate: true,
    members: ['6'],
    pendingRequests: [],
  }
];

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Load communities from localStorage or use mock data
    const storedCommunities = localStorage.getItem('devpulse_communities');
    if (storedCommunities) {
      setCommunities(JSON.parse(storedCommunities));
    } else {
      setCommunities(MOCK_COMMUNITIES);
    }
  }, []);

  // Save communities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devpulse_communities', JSON.stringify(communities));
  }, [communities]);

  const userCommunities = (userId: string) => {
    return communities.filter(community => community.members.includes(userId));
  };

  const getCommunity = (id: string) => {
    return communities.find(community => community.id === id);
  };

  const createCommunity = (newCommunity: Omit<Community, 'id' | 'memberCount' | 'members' | 'pendingRequests'>) => {
    const community: Community = {
      ...newCommunity,
      id: newCommunity.name.toLowerCase().replace(/\s+/g, '-'),
      memberCount: 1,
      members: [newCommunity.creatorId],
      pendingRequests: [],
    };
    setCommunities(prev => [...prev, community]);
  };

  const joinCommunity = (communityId: string, userId: string) => {
    setCommunities(prev =>
      prev.map(community => {
        if (community.id === communityId && !community.members.includes(userId)) {
          return {
            ...community,
            members: [...community.members, userId],
            memberCount: community.memberCount + 1,
          };
        }
        return community;
      })
    );
  };

  const requestToJoin = (communityId: string, userId: string) => {
    setCommunities(prev =>
      prev.map(community => {
        if (community.id === communityId && !community.pendingRequests.includes(userId)) {
          return {
            ...community,
            pendingRequests: [...community.pendingRequests, userId],
          };
        }
        return community;
      })
    );
  };

  const approveRequest = (communityId: string, userId: string) => {
    setCommunities(prev =>
      prev.map(community => {
        if (community.id === communityId && community.pendingRequests.includes(userId)) {
          return {
            ...community,
            members: [...community.members, userId],
            memberCount: community.memberCount + 1,
            pendingRequests: community.pendingRequests.filter(id => id !== userId),
          };
        }
        return community;
      })
    );
  };

  const rejectRequest = (communityId: string, userId: string) => {
    setCommunities(prev =>
      prev.map(community => {
        if (community.id === communityId && community.pendingRequests.includes(userId)) {
          return {
            ...community,
            pendingRequests: community.pendingRequests.filter(id => id !== userId),
          };
        }
        return community;
      })
    );
  };

  const leaveCommunity = (communityId: string, userId: string) => {
    setCommunities(prev =>
      prev.map(community => {
        if (community.id === communityId && community.members.includes(userId)) {
          return {
            ...community,
            members: community.members.filter(id => id !== userId),
            memberCount: community.memberCount - 1,
          };
        }
        return community;
      })
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        communities,
        userCommunities,
        getCommunity,
        createCommunity,
        joinCommunity,
        requestToJoin,
        approveRequest,
        rejectRequest,
        leaveCommunity,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
