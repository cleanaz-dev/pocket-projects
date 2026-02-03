import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/config"; 
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // LOGIC: Create a Family AND the Parent User at the same time
    // This ensures every user belongs to a family structure immediately
    const familyName = `${lastName} Family`;

    const newFamily = await prisma.family.create({
      data: {
        name: familyName,
        users: {
          create: {
            name: `${firstName} ${lastName}`,
            email: email,
            password: hashedPassword,
            type: "PARENT", // Default to parent on signup
          },
        },
      },
    });

    return NextResponse.json({ message: "User created", familyId: newFamily.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}