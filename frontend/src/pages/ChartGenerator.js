import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ChartGenerator = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  
  const [fileData, setFileData] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: '',
    description: ''
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [createdChart, setCreatedChart] = useState(null);

  useEffect(() => {
    fetchFileData();
  }, [fileId]);

  useEffect(() => {
    if (chartConfig.xAxis && chartConfig.yAxis && fileData) {
      generateChartData();
    }
  }, [chartConfig.xAxis, chartConfig.yAxis, chartConfig.type, fileData]);

  const fetchFileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/files/${fileId}/data`);
      setFileData(response.data);
      
      // Set default values
      if (response.data.fileInfo.headers.length > 0) {
        setChartConfig(prev => ({
          ...prev,
          xAxis: response.data.fileInfo.headers[0],
          yAxis: response.data.fileInfo.headers.length > 1 ? response.data.fileInfo.headers[1] : ''
        }));
      }
    } catch (error) {
      console.error('Error fetching file data:', error);
      setError('Failed to load file data');
      if (error.response?.status === 404) {
        navigate('/upload');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (!fileData || !chartConfig.xAxis || !chartConfig.yAxis) return;

    try {
      let processedData = [];

      switch (chartConfig.type) {
        case 'pie':
        case 'donut':
          processedData = processPieData();
          break;
        case 'scatter':
          processedData = processScatterData();
          break;
        default:
          processedData = processXYData();
      }

      setChartData(processedData);
    } catch (error) {
      console.error('Error processing chart data:', error);
      setError('Failed to process chart data');
    }
  };

  const processXYData = () => {
    const grouped = {};
    
    fileData.data.forEach(row => {
      const xValue = row[chartConfig.xAxis];
      const yValue = parseFloat(row[chartConfig.yAxis]);
      
      if (xValue !== null && xValue !== undefined && !isNaN(yValue)) {
        if (grouped[xValue]) {
          grouped[xValue] += yValue;
        } else {
          grouped[xValue] = yValue;
        }
      }
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // Limit to top 20 items
  };

  const processPieData = () => {
    const grouped = {};
    
    fileData.data.forEach(row => {
      const category = row[chartConfig.xAxis];
      const value = parseFloat(row[chartConfig.yAxis]) || 1;
      
      if (category !== null && category !== undefined) {
        grouped[category] = (grouped[category] || 0) + value;
      }
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Limit to top 10 for readability
  };

  const processScatterData = () => {
    return fileData.data
      .map(row => ({
        x: parseFloat(row[chartConfig.xAxis]) || 0,
        y: parseFloat(row[chartConfig.yAxis]) || 0
      }))
      .filter(item => !isNaN(item.x) && !isNaN(item.y))
      .slice(0, 100); // Limit points for performance
  };

  const handleConfigChange = (field, value) => {
    setChartConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChart = async () => {
    try {
      setGenerating(true);
      
      const response = await axios.post('/api/charts/create', {
        fileId,
        chartType: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        title: chartConfig.title || `${chartConfig.type} Chart - ${chartConfig.xAxis} vs ${chartConfig.yAxis}`,
        description: chartConfig.description,
        chartOptions: {
          colors: COLORS
        }
      });

      setCreatedChart(response.data);
      alert('Chart saved successfully!');
    } catch (error) {
      console.error('Error saving chart:', error);
      setError('Failed to save chart');
    } finally {
      setGenerating(false);
    }
  };

  const exportChart = async (format = 'png') => {
    try {
      const chartElement = document.getElementById('chart-container');
      if (!chartElement) return;

      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`chart-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export chart');
    }
  };

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data to display</p>
        </div>
      );
    }

    const commonProps = {
      width: '100%',
      height: 400,
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={chartData}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" />
              <YAxis type="number" dataKey="y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data Points" data={chartData} fill="#0088FE" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case '3d-column':
        return (
          <div style={{ height: '400px' }}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls />
              {chartData.slice(0, 10).map((item, index) => (
                <Box
                  key={index}
                  position={[index * 2 - chartData.length, item.value / 20, 0]}
                  args={[1, item.value / 10, 1]}
                >
                  <meshStandardMaterial color={COLORS[index % COLORS.length]} />
                </Box>
              ))}
            </Canvas>
          </div>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading file data..." />;
  }

  if (error && !fileData) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 mb-4">⚠️</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Upload New File
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chart Generator
        </h1>
        <p className="text-gray-600">
          Create interactive visualizations from your data: {fileData?.fileInfo.originalName}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <select
                  value={chartConfig.type}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="scatter">Scatter Plot</option>
                  <option value="3d-column">3D Column</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-Axis (Categories)
                </label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) => handleConfigChange('xAxis', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {fileData?.fileInfo.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y-Axis (Values)
                </label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) => handleConfigChange('yAxis', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {fileData?.fileInfo.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Title (Optional)
                </label>
                <input
                  type="text"
                  value={chartConfig.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  placeholder="Enter chart title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={chartConfig.description}
                  onChange={(e) => handleConfigChange('description', e.target.value)}
                  placeholder="Chart description"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <button
                  onClick={saveChart}
                  disabled={generating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {generating ? 'Saving...' : 'Save Chart'}
                </button>
                
                <button
                  onClick={() => exportChart('png')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Export as PNG
                </button>
                
                <button
                  onClick={() => exportChart('pdf')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Display */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {chartConfig.title || `${chartConfig.type} Chart`}
              </h3>
              {chartConfig.description && (
                <p className="text-gray-600 mt-1">{chartConfig.description}</p>
              )}
            </div>
            
            <div id="chart-container" className="bg-white">
              {renderChart()}
            </div>

            {chartData.length > 0 && (
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Showing {chartData.length} data points from {fileData?.fileInfo.rowCount} total rows
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartGenerator;