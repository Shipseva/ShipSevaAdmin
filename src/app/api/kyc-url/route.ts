import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
  const region = process.env.AWS_REGION || "ap-south-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS S3 configuration. Please check your environment variables.");
  }

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
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Missing 'key' query parameter" },
        { status: 400 }
      );
    }

    const s3Client = getS3Client();
    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME || "shipseva";

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Generate a signed URL valid for 1 hour (3600 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to generate signed URL";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

