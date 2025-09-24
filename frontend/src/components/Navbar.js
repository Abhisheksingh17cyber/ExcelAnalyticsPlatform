import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/upload', label: 'Upload', icon: '📁' },
  ];

  if (!user) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              📊 Excel Analytics
            </Link>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActivePath('/login') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActivePath('/register') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            📊 Excel Analytics
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActivePath(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            {user.isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActivePath('/admin')
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                <span>⚙️</span>
                <span>Admin</span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActivePath(link.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {user.isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActivePath('/admin')
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Admin</span>
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>👤</span>
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;