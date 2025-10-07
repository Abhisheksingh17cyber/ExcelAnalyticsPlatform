import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleLogin = () => {
  const [credentials, setCredentials] = useState({
    email: 'admin@demo.com',
    password: 'admin123'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const demoUsers = {
    'admin@demo.com': {
      password: 'admin123',
      user: {
        id: 'demo-admin',
        username: 'Admin User',
        email: 'admin@demo.com',
        isAdmin: true
      }
    },
    'user@demo.com': {
      password: 'user123',
      user: {
        id: 'demo-user',
        username: 'Demo User',
        email: 'user@demo.com',
        isAdmin: false
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = demoUsers[credentials.email.toLowerCase()];
    if (user && user.password === credentials.password) {
      setMessage('✅ Login successful! Welcome to the dashboard.');
      
      // Store in localStorage
      localStorage.setItem('demoUser', JSON.stringify(user.user));
      localStorage.setItem('token', 'demo-token-' + Date.now());
      
      // Redirect to simple dashboard
      setTimeout(() => {
        navigate('/simple-dashboard');
      }, 1500);
    } else {
      setMessage('❌ Invalid credentials. Use demo credentials provided below.');
    }
    
    setIsLoading(false);
  };

  const fillCredentials = (email, password) => {
    setCredentials({ email, password });
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
          <button className="text-white px-5 py-2 font-medium hover:bg-white/10 rounded-md transition-colors">
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
        {message && (
          <div className={`mb-5 p-3 rounded-md text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
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
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
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
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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

        {/* Demo Credentials */}
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="font-semibold text-blue-900 mb-3 text-sm">Demo Credentials:</div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Admin: </span>
              <button 
                type="button"
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('admin@demo.com', 'admin123')}
                title="Click to fill credentials"
              >
                admin@demo.com / admin123
              </button>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">User: </span>
              <button 
                type="button"
                className="text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => fillCredentials('user@demo.com', 'user123')}
                title="Click to fill credentials"
              >
                user@demo.com / user123
              </button>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-4 text-center text-xs text-gray-500">
          This is a demo mode. No real authentication required.
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;