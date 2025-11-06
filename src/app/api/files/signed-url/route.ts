import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Function to get S3 client (initialized with validated credentials)
function getS3Client(region: string, accessKeyId: string, secretAccessKey: string) {
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    // Validate AWS configuration
    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucketName) {
      console.error('AWS S3 Bucket name is not configured.');
      return NextResponse.json(
        { error: 'S3 bucket configuration is missing' },
        { status: 500 }
      );
    }

    if (!region || !accessKeyId || !secretAccessKey) {
      console.error('AWS credentials are not configured.');
      return NextResponse.json(
        { error: 'AWS credentials are missing' },
        { status: 500 }
      );
    }

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

    // Initialize S3 client with validated credentials
    const s3Client = getS3Client(region, accessKeyId, secretAccessKey);

    // Try multiple key variations if the key doesn't exist
    const keyVariations = [
      key, // Try as-is first
      key.startsWith('kyc/') ? key : `kyc/${key}`, // Try with kyc/ prefix
      key.startsWith('uploads/') ? key : `uploads/${key}`, // Try with uploads/ prefix
    ];
    
    // Remove duplicates
    const uniqueKeys = [...new Set(keyVariations)];
    
    let signedUrl: string | null = null;
    let lastError: Error | null = null;
    
    // Try each key variation
    for (const keyToTry of uniqueKeys) {
      try {
        // Create GetObject command
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: keyToTry,
        });

        // Generate pre-signed URL (expires in 1 hour)
        signedUrl = await getSignedUrl(s3Client, command, { 
          expiresIn: 3600 // 1 hour
        });
        
        // If we get here, the key exists
        console.log(`Successfully generated signed URL for key: ${keyToTry}`);
        break;
      } catch (err) {
        console.warn(`Failed to generate signed URL for key: ${keyToTry}`, err);
        lastError = err instanceof Error ? err : new Error('Unknown error');
        // Continue to next key variation
      }
    }
    
    if (!signedUrl) {
      console.error('All key variations failed. Last error:', lastError);
      return NextResponse.json(
        { 
          error: `File not found. Tried keys: ${uniqueKeys.join(', ')}`,
          triedKeys: uniqueKeys
        },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      url: signedUrl,
      expiresIn: 3600,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating signed URL:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate signed URL' },
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

