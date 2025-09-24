const mongoose = require('mongoose');

const chartAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileUpload',
    required: true
  },
  chartType: {
    type: String,
    enum: ['bar', 'line', 'pie', 'scatter', '3d-column', 'area', 'donut'],
    required: true
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  chartOptions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  title: {
    type: String,
    default: 'Untitled Chart'
  },
  description: {
    type: String,
    default: ''
  },
  aiInsights: {
    type: String,
    default: ''
  },
  colors: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
chartAnalysisSchema.index({ userId: 1, createdAt: -1 });
chartAnalysisSchema.index({ fileId: 1 });

module.exports = mongoose.model('ChartAnalysis', chartAnalysisSchema);