const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const FileUpload = require('../models/FileUpload');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// Upload Excel file
router.post('/upload', auth, upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    
    if (jsonData.length === 0) {
      fs.unlinkSync(req.file.path); // Delete uploaded file
      return res.status(400).json({ message: 'Excel file is empty or contains no data' });
    }

    const headers = Object.keys(jsonData[0]);

    if (headers.length === 0) {
      fs.unlinkSync(req.file.path); // Delete uploaded file
      return res.status(400).json({ message: 'Excel file has no headers' });
    }

    // Save file info to database
    const fileUpload = new FileUpload({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      headers,
      rowCount: jsonData.length,
      fileType: path.extname(req.file.originalname).toLowerCase().substring(1),
      status: 'completed'
    });

    await fileUpload.save();

    res.json({
      fileId: fileUpload._id,
      originalName: fileUpload.originalName,
      headers,
      rowCount: jsonData.length,
      fileSize: fileUpload.fileSize,
      uploadedAt: fileUpload.uploadedAt,
      data: jsonData.slice(0, 10), // Return first 10 rows as preview
      message: 'File uploaded successfully'
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('File upload error:', error);
    
    if (error.message.includes('Only Excel files')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error processing file upload' });
  }
});

// Get user's uploaded files
router.get('/my-files', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await FileUpload.find({ userId: req.userId })
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-filePath'); // Don't expose file path

    const total = await FileUpload.countDocuments({ userId: req.userId });

    res.json({
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

// Get file data for chart generation
router.get('/:fileId/data', auth, async (req, res) => {
  try {
    const file = await FileUpload.findOne({ 
      _id: req.params.fileId, 
      userId: req.userId 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if file still exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Parse Excel file
    const workbook = XLSX.readFile(file.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    // Update last accessed time
    file.lastAccessedAt = new Date();
    await file.save();

    res.json({
      fileInfo: {
        id: file._id,
        originalName: file.originalName,
        uploadedAt: file.uploadedAt,
        rowCount: file.rowCount,
        headers: file.headers
      },
      data: jsonData
    });

  } catch (error) {
    console.error('Get file data error:', error);
    res.status(500).json({ message: 'Error retrieving file data' });
  }
});

// Delete file
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const file = await FileUpload.findOne({ 
      _id: req.params.fileId, 
      userId: req.userId 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from database
    await FileUpload.findByIdAndDelete(req.params.fileId);

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Get file statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await FileUpload.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          totalRows: { $sum: '$rowCount' },
          avgRowsPerFile: { $avg: '$rowCount' }
        }
      }
    ]);

    const result = stats[0] || {
      totalFiles: 0,
      totalSize: 0,
      totalRows: 0,
      avgRowsPerFile: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Get file stats error:', error);
    res.status(500).json({ message: 'Error retrieving file statistics' });
  }
});

module.exports = router;