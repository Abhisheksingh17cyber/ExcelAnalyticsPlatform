import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload only Excel files (.xlsx, .xls)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploadStatus('uploading');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setUploadedFile(response.data);
      setUploadStatus('success');
      
      // Auto-redirect to chart generation after 2 seconds
      setTimeout(() => {
        navigate(`/charts/${response.data.fileId}`);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload file');
      setUploadStatus('error');
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
    disabled: uploadStatus === 'uploading',
  });

  const resetUpload = () => {
    setUploadStatus('idle');
    setUploadedFile(null);
    setError('');
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadStatus === 'uploading') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Uploading File...
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we process your Excel file
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  if (uploadStatus === 'success' && uploadedFile) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Upload Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your file has been processed successfully
            </p>

            {/* File Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">File Details:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {uploadedFile.originalName}</p>
                <p><span className="font-medium">Size:</span> {formatFileSize(uploadedFile.fileSize)}</p>
                <p><span className="font-medium">Rows:</span> {uploadedFile.rowCount.toLocaleString()}</p>
                <p><span className="font-medium">Columns:</span> {uploadedFile.headers.length}</p>
              </div>
              
              {/* Headers Preview */}
              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">Column Headers:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFile.headers.map((header, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {header}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => navigate(`/charts/${uploadedFile.fileId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Charts
              </button>
              <button
                onClick={resetUpload}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Upload Another
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Redirecting to chart generator in 2 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Excel File
        </h1>
        <p className="text-gray-600">
          Upload your Excel file to start analyzing and visualizing your data
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="mb-4">
            <span className="text-6xl">📁</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            or click to select a file from your computer
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Choose File
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Supported formats: .xlsx, .xls</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📋 File Requirements
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Your Excel file should have headers in the first row
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Data should be clean and properly formatted
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Numeric columns should contain only numbers for chart generation
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            File size should be under 10MB for optimal performance
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;