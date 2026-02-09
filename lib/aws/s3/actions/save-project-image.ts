import { s3Client, S3_BUCKET_NAME } from "../config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// Depending on your Node version/setup, you might strictly need this import, 
// though often Buffer is global.
import { Buffer } from "buffer"; 

export async function SaveProjectImage(
  imageUrl: string,
  familyId: string,
  projectId: string
) {
  try {
    // 1. Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // 2. Detect the real Content-Type
    // The server hosting the image usually sends this header (e.g., "image/jpeg")
    const contentType = response.headers.get("content-type") || "image/png";
    
    // 3. Determine the correct extension
    // Simple map for common types. Fallback to .png if unknown.
    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    const extension = extensionMap[contentType] || "png";

    const imageBuffer = await response.arrayBuffer();
    
    // 4. Generate Key with correct extension
    const timestamp = Date.now();
    const key = `${familyId}/projects/${projectId}/images/${timestamp}.${extension}`;

    // 5. Upload to S3 with correct ContentType
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(imageBuffer), // Buffer.from is correct for Node.js
      ContentType: contentType,       // Crucial: Set the real type
    });

    await s3Client.send(command);

    return key;

  } catch (error) {
    console.error("Error saving project image to S3:", error);
    throw error;
  }
}