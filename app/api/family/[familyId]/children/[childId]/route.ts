import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/config"; // Assuming you need DB access later

// 1. GET: Fetch data
export async function GET() {
  try {
    // Example: Fetch all users (replace with your real logic)
    // const users = await prisma.user.findMany();
    
    return NextResponse.json({ 
      message: "GET success", 
      data: [] // replace with users
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}

// 2. POST: Create data
export async function POST(req: Request) {
  try {
    // A. Parse the incoming JSON body
    const body = await req.json();
    
    // B. Basic Validation (Optional but recommended)
    if (!body.name) {
       return NextResponse.json(
        { error: "Name is required" }, 
        { status: 400 }
      );
    }

    // C. Perform Action (e.g., save to Prisma)
    // const newUser = await prisma.user.create({ data: body });

    return NextResponse.json({ 
      message: "Created successfully", 
      data: body // return the created object
    }, { status: 201 }); // 201 means "Created"

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}