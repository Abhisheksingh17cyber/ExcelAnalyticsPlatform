import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    files: { total: 0, totalSize: 0, totalRows: 0 },
    charts: { total: 0 }
  });
  const [recentFiles, setRecentFiles] = useState([]);
  const [recentCharts, setRecentCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats, recent files, and recent charts in parallel
      const [fileStatsRes, chartStatsRes, filesRes, chartsRes] = await Promise.all([
        axios.get('/api/files/stats'),
        axios.get('/api/charts/stats/overview'),
        axios.get('/api/files/my-files?limit=5'),
        axios.get('/api/charts/my-charts?limit=5')
      ]);

      setStats({
        files: fileStatsRes.data,
        charts: chartStatsRes.data
      });
      setRecentFiles(filesRes.data.files || []);
      setRecentCharts(chartsRes.data.charts || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">
          Here's an overview of your Excel analytics activity.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📁</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Files Uploaded</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.files.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Charts Created</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.charts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💾</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Data Size</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatFileSize(stats.files.totalSize)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Rows</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.files.totalRows.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Upload New File</h3>
          <p className="text-blue-100 mb-4">
            Upload an Excel file to start analyzing your data
          </p>
          <Link
            to="/upload"
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Upload File 📁
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Create Charts</h3>
          <p className="text-green-100 mb-4">
            Generate interactive visualizations from your data
          </p>
          {recentFiles.length > 0 ? (
            <Link
              to={`/charts/${recentFiles[0]._id}`}
              className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Create Chart 📊
            </Link>
          ) : (
            <span className="inline-block bg-white bg-opacity-50 text-green-100 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
              Upload file first
            </span>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Files</h3>
              <Link 
                to="/upload" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">📁</span>
                <p className="mb-4">No files uploaded yet</p>
                <Link 
                  to="/upload"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Upload your first file
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)} • {file.rowCount} rows
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <p className="text-xs text-gray-500">
                        {formatDate(file.uploadedAt)}
                      </p>
                      <Link
                        to={`/charts/${file._id}`}
                        className="text-xs text-blue-600 hover:text-blue-500 mt-1"
                      >
                        Create chart
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Charts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Charts</h3>
              <Link 
                to="/charts" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentCharts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="mb-4">No charts created yet</p>
                {recentFiles.length > 0 ? (
                  <Link 
                    to={`/charts/${recentFiles[0]._id}`}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Create your first chart
                  </Link>
                ) : (
                  <span className="text-gray-400">Upload a file first</span>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentCharts.map((chart) => (
                  <div key={chart._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chart.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chart.chartType} • {chart.fileId?.originalName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-4">
                      <p className="text-xs text-gray-500">
                        {formatDate(chart.createdAt)}
                      </p>
                      <Link
                        to={`/charts/${chart.fileId?._id}`}
                        className="text-xs text-blue-600 hover:text-blue-500 mt-1"
                      >
                        View chart
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;