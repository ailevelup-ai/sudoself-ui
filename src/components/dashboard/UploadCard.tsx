'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFileToS3 } from '@/lib/s3-upload';

interface UploadCardProps {
  onFilesUploaded: (files: any[]) => void;
}

export function UploadCard({ onFilesUploaded }: UploadCardProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'success' | 'error' | 'uploading'>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}`
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    
    // Clean up progress and status states
    const newUploadProgress = { ...uploadProgress };
    const newUploadStatus = { ...uploadStatus };
    delete newUploadProgress[id];
    delete newUploadStatus[id];
    
    setUploadProgress(newUploadProgress);
    setUploadStatus(newUploadStatus);
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;
    
    setUploading(true);
    const uploadedFiles: any[] = [];
    const tempUploadStatus = { ...uploadStatus };
    
    for (const file of files) {
      try {
        tempUploadStatus[file.id] = 'uploading';
        setUploadStatus({ ...tempUploadStatus });
        
        const result = await uploadFileToS3(file, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.id]: progress
          }));
        });
        
        tempUploadStatus[file.id] = 'success';
        uploadedFiles.push({
          id: result.key.split('/').pop(),
          title: file.name,
          type: file.type.split('/').pop().toUpperCase(),
          size: formatFileSize(file.size),
          uploadDate: new Date(),
          status: 'processing',
          s3Key: result.key,
          s3Location: result.location
        });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        tempUploadStatus[file.id] = 'error';
      }
      
      setUploadStatus({ ...tempUploadStatus });
    }
    
    // Only call the callback if at least one file was successfully uploaded
    if (uploadedFiles.length > 0) {
      onFilesUploaded(uploadedFiles);
    }
    
    setUploading(false);
    
    // Remove successfully uploaded files from the list
    setFiles(prev => prev.filter(file => uploadStatus[file.id] !== 'success'));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusIcon = (id: string) => {
    const status = uploadStatus[id];
    
    if (!status) return null;
    
    switch(status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Upload documents to analyze with SudoSelf
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <input {...getInputProps()} />
          <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground mb-1">
            {isDragActive
              ? "Drop the files here..."
              : "Drag 'n' drop files here, or click to select files"
            }
          </p>
          <p className="text-xs text-center text-muted-foreground">
            Support for PDF, DOCX, XLSX, PPTX, TXT (up to 20MB)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="divide-y rounded-md border">
              {files.map(file => (
                <div key={file.id} className="flex items-center p-3">
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.id)}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="rounded-full p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    {uploadStatus[file.id] === 'uploading' && (
                      <Progress 
                        value={uploadProgress[file.id] || 0} 
                        className="h-1 mt-2" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 