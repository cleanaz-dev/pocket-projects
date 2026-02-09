import { NextResponse } from "next/server"
import { generateProjectDescription } from "@/lib/moonshot"

export async function POST(req: Request) {
  try {
    const { projectName, category, gradeLevel } = await req.json()
    
    // CALLING THE ACTION HERE
    const description = await generateProjectDescription(projectName, category, gradeLevel)

    return NextResponse.json({ description })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}