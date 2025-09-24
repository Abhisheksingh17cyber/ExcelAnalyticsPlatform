const express = require('express');
const User = require('../models/User');
const FileUpload = require('../models/FileUpload');
const ChartAnalysis = require('../models/ChartAnalysis');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/all', auth, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Get user details (Admin only)
router.get('/:userId', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics
    const fileCount = await FileUpload.countDocuments({ userId: user._id });
    const chartCount = await ChartAnalysis.countDocuments({ userId: user._id });
    
    const fileSizeStats = await FileUpload.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' },
          totalRows: { $sum: '$rowCount' }
        }
      }
    ]);

    const stats = fileSizeStats[0] || { totalSize: 0, totalRows: 0 };

    res.json({
      user,
      statistics: {
        filesUploaded: fileCount,
        chartsCreated: chartCount,
        totalDataSize: stats.totalSize,
        totalDataRows: stats.totalRows
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Error retrieving user details' });
  }
});

// Update user (Admin only)
router.put('/:userId', auth, adminAuth, async (req, res) => {
  try {
    const { username, email, isAdmin } = req.body;
    const userId = req.params.userId;

    // Check if username/email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (Admin only)
router.delete('/:userId', auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Prevent admin from deleting themselves
    if (userId === req.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's files and charts
    const files = await FileUpload.find({ userId });
    const fs = require('fs');
    
    // Delete physical files
    files.forEach(file => {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath);
      }
    });

    // Delete database records
    await FileUpload.deleteMany({ userId });
    await ChartAnalysis.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get platform statistics (Admin only)
router.get('/stats/platform', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalFiles = await FileUpload.countDocuments();
    const totalCharts = await ChartAnalysis.countDocuments();

    // Get file size statistics
    const fileSizeStats = await FileUpload.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' },
          totalRows: { $sum: '$rowCount' },
          avgFileSize: { $avg: '$fileSize' }
        }
      }
    ]);

    // Get user activity statistics
    const userActivityStats = await User.aggregate([
      {
        $project: {
          daysSinceLastLogin: {
            $divide: [
              { $subtract: [new Date(), '$lastLogin'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          activeUsers: {
            $sum: {
              $cond: [{ $lte: ['$daysSinceLastLogin', 7] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get chart type distribution
    const chartTypeStats = await ChartAnalysis.aggregate([
      {
        $group: {
          _id: '$chartType',
          count: { $sum: 1 }
        }
      }
    ]);

    const fileStats = fileSizeStats[0] || { 
      totalSize: 0, 
      totalRows: 0, 
      avgFileSize: 0 
    };
    
    const activityStats = userActivityStats[0] || { activeUsers: 0 };

    res.json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        activeLastWeek: activityStats.activeUsers
      },
      files: {
        total: totalFiles,
        totalSize: fileStats.totalSize,
        totalRows: fileStats.totalRows,
        avgSize: fileStats.avgFileSize
      },
      charts: {
        total: totalCharts,
        typeDistribution: chartTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ message: 'Error retrieving platform statistics' });
  }
});

// Search users (Admin only)
router.get('/search/:query', auth, adminAuth, async (req, res) => {
  try {
    const query = req.params.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, 'i');
    
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { email: searchRegex }
      ]
    })
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { username: searchRegex },
        { email: searchRegex }
      ]
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      query
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router;