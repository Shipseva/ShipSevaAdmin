import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    // Get the key from query parameters
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Validate required fields
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Create GetObject command
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });

    // Generate pre-signed URL (expires in 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    });

    const response = {
      success: true,
      url: signedUrl,
      expiresIn: 3600,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating signed URL:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

