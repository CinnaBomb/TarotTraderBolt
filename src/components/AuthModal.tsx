import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  isMainLogin?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, isMainLogin = false }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  
  const { signIn, signUp, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.name);
        setSuccess('Account created successfully! Please check your email to verify your account.');
      } else {
        await signIn(formData.email, formData.password);
        setSuccess('Signed in successfully!');
      }
      
      if (!isMainLogin) {
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      console.log('Error message:', error.message);
      console.log('Setting error state...');
      
      // Handle specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        if (isSignUp) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError('❌ Account not found! This email doesn\'t exist in our system. Please click "Sign Up" below to create a new account.');
        }
        console.log('Error state set for invalid credentials');
      } else if (error.message?.includes('User already registered')) {
        setError('✅ This email already has an account! Switch to "Sign In" to log into your existing account.');
      } else if (error.message?.includes('Password should be at least')) {
        setError('Password must be at least 6 characters long.');
      } else if (error.message?.includes('Unable to validate email address')) {
        setError('Please enter a valid email address.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else if (error.message?.includes('signup disabled')) {
        setError('Account registration is currently disabled. Please contact support.');
      } else if (error.message?.includes('Invalid login credentials')) {
        setError(`Invalid email or password. ${!isSignUp ? 'If you don\'t have an account yet, click "Sign Up" below.' : 'Please check your credentials and try again.'}`);
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  // If user is already logged in and this is not the main login, show profile info
  if (user && !isMainLogin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-yellow-400">Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  const containerClass = isMainLogin 
    ? "flex items-center justify-center min-h-screen p-4" 
    : "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50";

  return (
    <div className={containerClass}>
      {/* Main Login Page Header */}
      {isMainLogin && (
        <div className="text-center mb-8 absolute top-16 left-1/2 transform -translate-x-1/2">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">Tarot Trader</h1>
          <p className="text-gray-300">Discover Your Destiny</p>
        </div>
      )}
      
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-yellow-400">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          {!isMainLogin && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/30 border-2 border-red-500/70 rounded-lg animate-pulse">
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/30 border-2 border-green-500/70 rounded-lg">
            <p className="text-green-200 text-sm font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-blue-500/20 border border-blue-500/50 rounded text-xs text-blue-300">
              <p>Debug Mode: Check browser console for detailed logs</p>
              <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Connected' : '✗ Missing'}</p>
              <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Available' : '✗ Missing'}</p>
              <p>URL Preview: {import.meta.env.VITE_SUPABASE_URL?.slice(0, 30)}...</p>
              <p>Error State: {error ? `"${error}"` : 'No error'}</p>
              <p>Success State: {success ? `"${success}"` : 'No success'}</p>
              <p>Loading State: {isLoading ? 'TRUE' : 'FALSE'}</p>
            </div>
          )}
          
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {/* Development Test Button */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <button
                type="button"
                onClick={() => setError('❌ Test error message - This should appear in red!')}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg font-medium transition-colors text-xs mb-2"
              >
                🔴 Test Error Display
              </button>
              
              <button
                type="button"
                onClick={async () => {
                  console.log('Testing authentication with test@example.com');
                  setError('');
                  setSuccess('');
                  try {
                    await signIn('test@example.com', 'testpassword');
                    setSuccess('Test sign-in successful!');
                  } catch (error: any) {
                    console.log('Test sign-in failed, trying to create test account...');
                    try {
                      await signUp('test@example.com', 'testpassword', 'Test User');
                      setSuccess('Test account created and signed in!');
                    } catch (signupError: any) {
                      setError(`Test failed: ${signupError.message}`);
                    }
                  }
                }}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg font-medium transition-colors text-sm"
              >
                🧪 Test Authentication (Dev Only)
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
              setFormData({ email: '', password: '', name: '' });
            }}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors mt-1"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;