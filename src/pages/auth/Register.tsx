
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Mail, User, Key, Eye, EyeOff } from 'lucide-react';
import DevButton from '@/components/ui/dev-button';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, verifyEmail, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1) {
      if (!email || !username || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      try {
        await register(email, username, password);
        setStep(2);
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    } else if (step === 2) {
      if (!verificationCode) {
        setError('Please enter the verification code');
        return;
      }
      
      try {
        await verifyEmail(email, verificationCode);
        navigate('/setup-profile');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Verification failed. Please try again.');
        }
      }
    }
  };

  const resendCode = () => {
    // In a real app, this would call an API to resend the code
    setTimeout(() => {
      alert('A new verification code has been sent to your email');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-devpulse-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-devpulse-secondary bg-clip-text text-transparent">
            DevPulse Network
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join the community of developers
          </p>
        </div>
        
        <div className="dev-card p-6">
          <h2 className="text-xl font-semibold mb-2">
            {step === 1 ? 'Create your account' : 'Verify your email'}
          </h2>
          
          <p className="text-muted-foreground text-sm mb-6">
            {step === 1 
              ? 'Fill in your details to get started' 
              : `We've sent a verification code to ${email}`}
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
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
                
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <User size={16} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      className="dev-input w-full pl-10"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
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
                      placeholder="Create a strong password"
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
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Key size={16} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="dev-input w-full pl-10"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  className="dev-input w-full text-center text-xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Didn't receive a code?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={resendCode}
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
            
            <DevButton
              type="submit"
              className="w-full mb-4"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              {step === 1 ? 'Continue' : 'Verify & Create Account'}
            </DevButton>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
        
        {step === 2 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              For demo purposes, use code: <span className="text-primary">123456</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
