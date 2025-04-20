
import React, { createContext, useState, useContext, useEffect } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  profession?: string;
  fieldOfStudy?: string;
  skills?: string[];
  experience?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('devpulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    try {
      // This would be an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mocked response
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        email: email,
        profilePicture: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
        profession: 'Software Engineer',
        fieldOfStudy: 'Computer Science',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: '5 years'
      };
      
      localStorage.setItem('devpulse_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a user in the database
      console.log('User registered', { email, username });
      
      // Return success but don't log in yet (need email verification)
      return;
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mocked verification (in a real app, would verify the code with backend)
      if (code === '123456') {
        const newUser: User = {
          id: '1',
          username: email.split('@')[0],
          email: email,
        };
        localStorage.setItem('devpulse_user', JSON.stringify(newUser));
        setUser(newUser);
        return;
      }
      throw new Error('Invalid verification code');
    } catch (error) {
      console.error('Verification failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('devpulse_user');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('devpulse_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Profile update failed', error);
      throw new Error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
