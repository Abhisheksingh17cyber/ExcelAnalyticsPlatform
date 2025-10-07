import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Check for demo user first
      const demoUser = localStorage.getItem('demoUser');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
        setError(null);
        return;
      }
      
      // Try backend user fetch
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Fetch current user error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('demoUser');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Demo user authentication (fallback if backend is not available)
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
      
      // Check demo credentials first
      const demoUser = demoUsers[email.toLowerCase()];
      if (demoUser && demoUser.password === password) {
        const demoToken = 'demo-jwt-token-' + Date.now();
        localStorage.setItem('token', demoToken);
        localStorage.setItem('demoUser', JSON.stringify(demoUser.user));
        setUser(demoUser.user);
        return { success: true, message: 'Demo login successful' };
      }
      
      // Try backend authentication
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.removeItem('demoUser'); // Clear demo user if real login
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        
        return { success: true, message: 'Login successful' };
      } catch (backendError) {
        // If backend fails and not demo user, show error
        const message = backendError.response?.data?.message || 'Invalid credentials. Use demo credentials: admin@demo.com/admin123 or user@demo.com/user123';
        setError(message);
        return { success: false, message };
      }
    } catch (error) {
      const message = 'Login failed. Use demo credentials: admin@demo.com/admin123';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', { 
        username, 
        email, 
        password 
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      setError(null);
      const response = await axios.put('/api/auth/profile', updateData);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const response = await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoUser');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    updateProfile,
    changePassword,
    logout,
    clearError,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}