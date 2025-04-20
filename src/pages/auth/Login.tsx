
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Mail, Key, Eye, EyeOff } from 'lucide-react';
import DevButton from '@/components/ui/dev-button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-devpulse-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
            DevPulse Network
          </h1>
          <p className="mt-2 text-muted-foreground">
            Connect with developers from around the world
          </p>
        </div>
        
        <div className="dev-card p-6">
          <h2 className="text-xl font-semibold mb-6">Welcome back</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  className="dev-input w-full pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Key size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="dev-input w-full pl-10"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <DevButton
              type="submit"
              className="w-full mb-4"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Sign in
            </DevButton>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/auth/register" className="text-primary hover:underline">
                Create one
              </Link>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            For demo purposes, you can use:<br />
            Email: <span className="text-primary">demo@example.com</span><br />
            Password: <span className="text-primary">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
