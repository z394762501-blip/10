import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { User, FileAttachment } from '../types/user';

interface FileUploadProps {
  section: string;
  currentUser: User;
  onUpload: (files: File[], section: string) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

export default function FileUpload({ 
  section, 
  currentUser, 
  onUpload, 
  maxFileSize = 10,
  allowedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.xlsx', '.pptx']
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.includes(fileExtension);
      const isValidSize = file.size <= maxFileSize * 1024 * 1024;
      return isValidType && isValidSize;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadStatus('idle');
    
    try {
      await onUpload(files, section);
      setUploadStatus('success');
      setFiles([]);
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
        <span className="text-sm text-gray-500">
          Max {maxFileSize}MB per file
        </span>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={allowedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supported formats: {allowedTypes.join(', ')}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button and Status */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {uploadStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Files uploaded successfully!</span>
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">Upload failed. Please try again.</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </div>
    </div>
  );
}