import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "../config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });
  // Sign the URL to expire in 1 hour (3600 seconds)
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}