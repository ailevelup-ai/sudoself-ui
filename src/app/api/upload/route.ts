import { NextRequest, NextResponse } from 'next/server';
import * as AWS from 'aws-sdk';

// Initialize the S3 client
// In production, this would use environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'sudoself-docs';

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Get the file key from the form data or generate one
    let key = formData.get('key') as string;
    
    if (!key) {
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      key = `uploads/${sanitizedFileName}-${timestamp}.${fileExtension}`;
    }
    
    // Get the file contents as an ArrayBuffer
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    
    // Set up the S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type,
      // You can add additional parameters like ACL, metadata, etc.
    };
    
    // Upload to S3
    const uploadResult = await s3.upload(params).promise();
    
    // Now trigger the document processing workflow
    // This would typically call another API or service
    await triggerDocumentProcessing({
      key: uploadResult.Key,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });
    
    // Return the upload information
    return NextResponse.json({
      success: true,
      key: uploadResult.Key,
      location: uploadResult.Location,
      bucket: BUCKET_NAME,
    });
  } catch (error: any) {
    console.error('S3 upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'File upload failed',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Function to trigger the document processing workflow
 * This would integrate with the ingestion workflow as described in ingestion-workflow.md
 */
async function triggerDocumentProcessing(document: {
  key: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  try {
    // Call the ingestion service API to start processing
    const response = await fetch(process.env.INGESTION_API_URL || 'http://localhost:3001/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: document.key.split('/').pop(),
        s3Key: document.key,
        s3Bucket: BUCKET_NAME,
        filename: document.filename,
        contentType: document.contentType,
        size: document.size,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ingestion service returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error triggering document processing:', error);
    // We don't throw here as we still want to return the S3 upload success
    // The document can be reprocessed later if needed
  }
} 