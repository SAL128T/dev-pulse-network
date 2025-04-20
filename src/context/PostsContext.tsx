
import React, { createContext, useState, useContext, useEffect } from 'react';

export type Post = {
  id: string;
  userId: string;
  username: string;
  userProfilePic?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  communityId?: string;
};

export type Comment = {
  id: string;
  userId: string;
  username: string;
  userProfilePic?: string;
  content: string;
  createdAt: string;
};

type PostsContextType = {
  posts: Post[];
  userPosts: (userId: string) => Post[];
  communityPosts: (communityId: string) => Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    userId: '2',
    username: 'sarahjones',
    userProfilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    content: 'Looking for teammates on a React Native project. Need someone with experience in animations and state management. DM if interested!',
    likes: 24,
    comments: [
      {
        id: '101',
        userId: '3',
        username: 'mikesmith',
        userProfilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        content: 'I have 3 years of experience with React Native. Would love to help!',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    username: 'mikesmith',
    userProfilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    content: 'Just found this crazy bug in my TypeScript project. Has anyone seen this before?\n\n```typescript\ntype X = string & number; // This should be impossible!\n```',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    likes: 42,
    comments: [
      {
        id: '201',
        userId: '4',
        username: 'emilywong',
        userProfilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        content: 'That\'s intersection types for you! It creates a type that\'s impossible to instantiate.',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '3',
    userId: '4',
    username: 'emilywong',
    userProfilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    content: 'Just launched my new portfolio site using Next.js and Tailwind CSS. Would love feedback from fellow developers!',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    likes: 78,
    comments: [],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '4',
    userId: '5',
    username: 'alexchen',
    userProfilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    content: 'Anyone using Go for microservices? I\'m considering switching from Node.js and would love some insights.',
    likes: 31,
    comments: [
      {
        id: '401',
        userId: '2',
        username: 'sarahjones',
        userProfilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        content: 'We made the switch last year and performance has been amazing. Happy to chat about our experience!',
        createdAt: new Date(Date.now() - 21600000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    communityId: 'backend-dev',
  },
  {
    id: '5',
    userId: '6',
    username: 'davidlee',
    userProfilePic: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1',
    content: 'What\'s your preferred state management solution for React in 2025? Still using Redux or have you moved on?',
    likes: 65,
    comments: [
      {
        id: '501',
        userId: '3',
        username: 'mikesmith',
        userProfilePic: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        content: 'Context API + useReducer for most projects, Redux only for the complex ones.',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: '502',
        userId: '4',
        username: 'emilywong',
        userProfilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        content: 'Zustand has been my go-to lately. Much simpler than Redux!',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    communityId: 'frontend-dev',
  }
];

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Load posts from localStorage or use mock data
    const storedPosts = localStorage.getItem('devpulse_posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(MOCK_POSTS);
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('devpulse_posts', JSON.stringify(posts));
  }, [posts]);

  const userPosts = (userId: string) => {
    return posts.filter(post => post.userId === userId);
  };

  const communityPosts = (communityId: string) => {
    return posts.filter(post => post.communityId === communityId);
  };

  const addPost = (newPost: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [post, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId: string, newComment: Omit<Comment, 'id' | 'createdAt'>) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const comment: Comment = {
            ...newComment,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          return {
            ...post,
            comments: [...post.comments, comment],
          };
        }
        return post;
      })
    );
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        userPosts,
        communityPosts,
        addPost,
        likePost,
        addComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
