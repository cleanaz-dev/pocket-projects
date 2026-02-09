// app/api/generate/generate-project-image/route.ts
import { NextResponse } from "next/server";
import { generateProjectImage } from "@/lib/replicate";

export async function POST(req: Request) {
  try {
    const { projectName, category, gradeLevel } = await req.json();

    const imageUrl = await generateProjectImage(projectName, category, gradeLevel);

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}