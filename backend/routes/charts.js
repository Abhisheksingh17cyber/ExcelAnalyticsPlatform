const express = require('express');
const ChartAnalysis = require('../models/ChartAnalysis');
const FileUpload = require('../models/FileUpload');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a new chart analysis
router.post('/create', auth, async (req, res) => {
  try {
    const { 
      fileId, 
      chartType, 
      xAxis, 
      yAxis, 
      title, 
      description, 
      chartOptions,
      colors,
      tags
    } = req.body;

    // Validate required fields
    if (!fileId || !chartType || !xAxis || !yAxis) {
      return res.status(400).json({ 
        message: 'Missing required fields: fileId, chartType, xAxis, yAxis' 
      });
    }

    // Verify file belongs to user
    const file = await FileUpload.findOne({ 
      _id: fileId, 
      userId: req.userId 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Process chart data based on type
    const chartData = await processChartData(file, chartType, xAxis, yAxis);

    if (!chartData) {
      return res.status(400).json({ message: 'Unable to process chart data' });
    }

    // Create chart analysis
    const chartAnalysis = new ChartAnalysis({
      userId: req.userId,
      fileId,
      chartType,
      xAxis,
      yAxis,
      chartData,
      title: title || `${chartType} Chart - ${xAxis} vs ${yAxis}`,
      description: description || '',
      chartOptions: chartOptions || {},
      colors: colors || [],
      tags: tags || []
    });

    await chartAnalysis.save();

    res.status(201).json({
      chartId: chartAnalysis._id,
      chartAnalysis,
      message: 'Chart created successfully'
    });

  } catch (error) {
    console.error('Create chart error:', error);
    res.status(500).json({ message: 'Error creating chart' });
  }
});

// Get user's chart analyses
router.get('/my-charts', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const charts = await ChartAnalysis.find({ userId: req.userId })
      .populate('fileId', 'originalName uploadedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ChartAnalysis.countDocuments({ userId: req.userId });

    res.json({
      charts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ message: 'Error retrieving charts' });
  }
});

// Get specific chart
router.get('/:chartId', auth, async (req, res) => {
  try {
    const chart = await ChartAnalysis.findOne({ 
      _id: req.params.chartId, 
      userId: req.userId 
    }).populate('fileId', 'originalName uploadedAt headers rowCount');

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    res.json(chart);
  } catch (error) {
    console.error('Get chart error:', error);
    res.status(500).json({ message: 'Error retrieving chart' });
  }
});

// Update chart
router.put('/:chartId', auth, async (req, res) => {
  try {
    const { title, description, chartOptions, colors, tags, isPublic } = req.body;

    const chart = await ChartAnalysis.findOne({ 
      _id: req.params.chartId, 
      userId: req.userId 
    });

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    // Update fields
    if (title !== undefined) chart.title = title;
    if (description !== undefined) chart.description = description;
    if (chartOptions !== undefined) chart.chartOptions = chartOptions;
    if (colors !== undefined) chart.colors = colors;
    if (tags !== undefined) chart.tags = tags;
    if (isPublic !== undefined) chart.isPublic = isPublic;
    
    chart.updatedAt = new Date();

    await chart.save();

    res.json({ chart, message: 'Chart updated successfully' });
  } catch (error) {
    console.error('Update chart error:', error);
    res.status(500).json({ message: 'Error updating chart' });
  }
});

// Delete chart
router.delete('/:chartId', auth, async (req, res) => {
  try {
    const chart = await ChartAnalysis.findOne({ 
      _id: req.params.chartId, 
      userId: req.userId 
    });

    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }

    await ChartAnalysis.findByIdAndDelete(req.params.chartId);

    res.json({ message: 'Chart deleted successfully' });
  } catch (error) {
    console.error('Delete chart error:', error);
    res.status(500).json({ message: 'Error deleting chart' });
  }
});

// Get chart statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await ChartAnalysis.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$chartType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCharts = await ChartAnalysis.countDocuments({ userId: req.userId });

    res.json({
      totalCharts,
      chartTypeBreakdown: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get chart stats error:', error);
    res.status(500).json({ message: 'Error retrieving chart statistics' });
  }
});

// Helper function to process chart data
async function processChartData(file, chartType, xAxis, yAxis) {
  try {
    const XLSX = require('xlsx');
    const fs = require('fs');

    if (!fs.existsSync(file.filePath)) {
      throw new Error('File not found on server');
    }

    // Parse Excel file
    const workbook = XLSX.readFile(file.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    // Process data based on chart type
    switch (chartType) {
      case 'bar':
      case 'line':
      case 'area':
        return processXYData(jsonData, xAxis, yAxis);
      
      case 'pie':
      case 'donut':
        return processPieData(jsonData, xAxis, yAxis);
      
      case 'scatter':
        return processScatterData(jsonData, xAxis, yAxis);
      
      case '3d-column':
        return process3DData(jsonData, xAxis, yAxis);
      
      default:
        return processXYData(jsonData, xAxis, yAxis);
    }
  } catch (error) {
    console.error('Process chart data error:', error);
    return null;
  }
}

function processXYData(data, xAxis, yAxis) {
  const processedData = data
    .filter(row => row[xAxis] !== null && row[yAxis] !== null)
    .map(row => ({
      x: row[xAxis],
      y: parseFloat(row[yAxis]) || 0,
      name: row[xAxis]
    }));

  return {
    data: processedData,
    xAxisLabel: xAxis,
    yAxisLabel: yAxis
  };
}

function processPieData(data, xAxis, yAxis) {
  const groupedData = data.reduce((acc, row) => {
    const key = row[xAxis];
    const value = parseFloat(row[yAxis]) || 0;
    
    if (key !== null && key !== undefined) {
      acc[key] = (acc[key] || 0) + value;
    }
    
    return acc;
  }, {});

  const processedData = Object.entries(groupedData).map(([name, value]) => ({
    name,
    value
  }));

  return {
    data: processedData,
    labelKey: xAxis,
    valueKey: yAxis
  };
}

function processScatterData(data, xAxis, yAxis) {
  const processedData = data
    .filter(row => row[xAxis] !== null && row[yAxis] !== null)
    .map((row, index) => ({
      x: parseFloat(row[xAxis]) || 0,
      y: parseFloat(row[yAxis]) || 0,
      id: index
    }));

  return {
    data: processedData,
    xAxisLabel: xAxis,
    yAxisLabel: yAxis
  };
}

function process3DData(data, xAxis, yAxis) {
  const processedData = data
    .filter(row => row[xAxis] !== null && row[yAxis] !== null)
    .map(row => ({
      x: row[xAxis],
      y: parseFloat(row[yAxis]) || 0,
      z: Math.random() * 10 // Placeholder for 3D depth
    }));

  return {
    data: processedData,
    xAxisLabel: xAxis,
    yAxisLabel: yAxis,
    zAxisLabel: 'Depth'
  };
}

module.exports = router;