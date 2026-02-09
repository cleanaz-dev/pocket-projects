// app/api/family/[familyId]/media/[...key]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/aws";

interface Params {
  params: Promise<{
    familyId: string;
    key: string[];
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { familyId: string; key: string[] } },
) {
  const { familyId, key } = await params;

  // ✅ FIX: Include familyId in the S3 key
  const fileKey = `${familyId}/${key.join("/")}`;
  console.log("File Key 🖼️:", fileKey);

  try {
    // 2. Get the presigned URL
    const signedUrl = await getPresignedUrl(fileKey);
    console.log("🔥 Fetching from S3:", signedUrl);

    // 3. Fetch the actual image from S3
    const s3Response = await fetch(signedUrl);

    if (!s3Response.ok) {
      console.error("S3 fetch failed:", s3Response.status);
      return new NextResponse("File not found", { status: 404 });
    }

    // 4. Get the image buffer
    const imageBuffer = await s3Response.arrayBuffer();

    // 5. Get content type from S3 response or infer from file extension
    const contentType = s3Response.headers.get("Content-Type") || getContentType(fileKey);

    // 6. Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("S3 Error:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}

// Helper function to determine content type from file extension
function getContentType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };

  return mimeTypes[ext || ""] || "image/png";
}