/**
 * This file contains utility functions for uploading files to S3
 */

// This would typically use AWS SDK, but for now we'll implement a function
// that communicates with our backend API which handles the S3 upload

interface S3UploadResponse {
  key: string;
  location: string;
  bucket: string;
}

/**
 * Uploads a file to S3 via the backend API
 * @param file The file to upload
 * @param onProgress Optional callback for progress updates (0-100)
 * @returns Promise with the S3 upload response
 */
export async function uploadFileToS3(file: File, onProgress?: (progress: number) => void): Promise<S3UploadResponse> {
  // Generate a unique file key by adding timestamp to prevent collisions
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split('.').pop() || '';
  const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
  const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileKey = `uploads/${sanitizedFileName}-${timestamp}.${fileExtension}`;
  
  // Create FormData to send the file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('key', fileKey);
  
  // Declare progress interval outside try block so it's accessible in catch block
  let progressInterval: NodeJS.Timeout | undefined;
  
  try {
    // Simulate progress updates if callback is provided
    if (onProgress) {
      let progress = 0;
      progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) {
          progress = 95; // Keep at 95% until complete
          if (progressInterval) clearInterval(progressInterval);
        }
        onProgress(Math.min(Math.round(progress), 95));
      }, 500);
    }
    
    // Call the backend API to handle the S3 upload
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }
    
    // Clear the progress interval if it exists
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    // Set progress to 100% when complete
    if (onProgress) {
      onProgress(100);
    }
    
    const data = await response.json();
    
    // Return the S3 object information
    return {
      key: data.key || fileKey,
      location: data.location || `https://s3.amazonaws.com/sudoself-docs/${fileKey}`,
      bucket: data.bucket || 'sudoself-docs'
    };
  } catch (error) {
    // Clear the progress interval if it exists
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    
    // Rethrow the error to be handled by the caller
    throw error;
  }
} 