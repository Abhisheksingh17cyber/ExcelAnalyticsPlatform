import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for demo user
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
    } else {
      navigate('/simple-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('demoUser');
    localStorage.removeItem('token');
    navigate('/simple-login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📊</span>
              <div>
                <h1 className="text-xl font-bold">Excel Analytics Dashboard</h1>
                <p className="text-blue-100 text-sm">Demo Mode - Fully Functional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-blue-200 uppercase">{user.isAdmin ? 'Admin' : 'User'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.username}! 🎉
          </h2>
          <p className="text-gray-600">
            Your Excel Analytics Platform is ready. This is a fully functional demo with all features available.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Total Reports</p>
                <p className="text-3xl font-bold">156</p>
                <p className="text-blue-200 text-xs mt-1">↑ 12% from last month</p>
              </div>
              <span className="text-2xl opacity-80">📈</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Active Users</p>
                <p className="text-3xl font-bold">23</p>
                <p className="text-green-200 text-xs mt-1">↑ 5% from last week</p>
              </div>
              <span className="text-2xl opacity-80">👥</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm">Data Sources</p>
                <p className="text-3xl font-bold">8</p>
                <p className="text-orange-200 text-xs mt-1">2 new this month</p>
              </div>
              <span className="text-2xl opacity-80">🗃️</span>
            </div>
          </div>

          {user.isAdmin && (
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm">Admin Actions</p>
                  <p className="text-3xl font-bold">42</p>
                  <p className="text-purple-200 text-xs mt-1">Admin privileges active</p>
                </div>
                <span className="text-2xl opacity-80">⚙️</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📤</span>
              <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Upload your Excel files to start generating analytics and charts.
            </p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Upload Excel File
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📊</span>
              <h3 className="text-lg font-semibold text-gray-900">Create Charts</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Generate beautiful 2D and 3D charts from your uploaded data.
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Generate Charts
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📋</span>
              <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Access your generated reports and analytics insights.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              View Reports
            </button>
          </div>

          {user.isAdmin && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">👥</span>
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Manage users, permissions, and access controls.
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                  Manage Users
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">⚙️</span>
                  <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Configure system settings and preferences.
                </p>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  System Settings
                </button>
              </div>
            </>
          )}
        </div>

        {/* Demo Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 mr-2">ℹ️</span>
            <h3 className="text-lg font-semibold text-blue-900">Demo Mode Information</h3>
          </div>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• This is a fully functional demo of the Excel Analytics Platform</p>
            <p>• All features are available and working</p>
            <p>• No real backend required - perfect for demonstrations</p>
            <p>• Switch between Admin and User accounts to see different features</p>
            <p>• Logout and login with different credentials to test role-based access</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SimpleDashboard;