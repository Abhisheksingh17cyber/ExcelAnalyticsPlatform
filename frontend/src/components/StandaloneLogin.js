import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StandaloneLogin = () => {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Demo users data
  const demoUsers = {
    'admin@demo.com': {
      password: 'admin123',
      role: 'admin',
      name: 'Admin User'
    },
    'user@demo.com': {
      password: 'user123',
      role: 'user',
      name: 'Demo User'
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userEmail = email.trim().toLowerCase();
      const user = demoUsers[userEmail];

      if (user && user.password === password) {
        // Successful login
        setMessage({ 
          type: 'success', 
          text: `Welcome ${user.name}! Loading your dashboard...` 
        });

        // Use the context login function
        await login(userEmail, password);
        
        // Navigate after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error('Invalid email or password. Please use the demo credentials provided.');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const showComingSoon = () => {
    setMessage({ 
      type: 'info', 
      text: 'Registration feature coming soon! Please use the demo credentials for now.' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-5">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-white/10 backdrop-blur-lg">
        <div className="flex items-center gap-3 text-white">
          <span className="text-2xl">📊</span>
          <span className="text-xl font-semibold hidden sm:block">Excel Analytics</span>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
            Login
          </button>
          <button 
            onClick={showComingSoon}
            className="text-white px-5 py-2 font-medium hover:bg-white/10 rounded-md transition-colors"
          >
            Register
          </button>
        </div>
      </div>

      {/* Login Container */}
      <div className={`bg-white p-10 rounded-xl shadow-2xl w-full max-w-md mt-20 transition-opacity ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        {/* Login Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in to your account
          </h1>
          <p className="text-gray-600">Access your Excel Analytics Dashboard</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-5 p-3 rounded-md flex items-center gap-2 text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : message.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <span>
              {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            {message.text}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-5 text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={showComingSoon}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up here
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="font-semibold text-blue-900 mb-3 text-sm">Demo Credentials:</div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Admin: </span>
              <span 
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('admin@demo.com', 'admin123')}
                title="Click to fill credentials"
              >
                admin@demo.com
              </span>
              <span className="mx-1">/</span>
              <span 
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('admin@demo.com', 'admin123')}
                title="Click to fill credentials"
              >
                admin123
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">User: </span>
              <span 
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('user@demo.com', 'user123')}
                title="Click to fill credentials"
              >
                user@demo.com
              </span>
              <span className="mx-1">/</span>
              <span 
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('user@demo.com', 'user123')}
                title="Click to fill credentials"
              >
                user123
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneLogin;