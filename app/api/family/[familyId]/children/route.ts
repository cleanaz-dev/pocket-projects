import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@/lib/generated/prisma/client";

interface Params {
  params: Promise<{
    familyId: string;
  }>;
}

interface CreateChildBody {
  name: string;
  username: string;
  email?: string | null;
  password: string;
  avatar?: string;
}

export async function POST(req: Request, { params }: Params) {
  const { familyId } = await params;

  if (!familyId) {
    return NextResponse.json(
      { error: "Family ID is required" },
      { status: 400 },
    );
  }

  try {
    const body: CreateChildBody = await req.json();
    console.log("body:", body)
    // 1. Validate required fields
    if (!body.name || !body.username || !body.password) {
      return NextResponse.json(
        { error: "Name, username, and password are required" },
        { status: 400 },
      );
    }

    // 2. Verify family exists
    const family = await prisma.family.findUnique({
      where: { id: familyId },
    });

    if (!family) {
      return NextResponse.json({ error: "Family not found" }, { status: 404 });
    }

    // 3. Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 },
      );
    }

    // 4. Check if email already exists (only if email was provided)
    if (body.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: body.email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 },
        );
      }
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    /**
     * FIX: Build the data object dynamically.
     * We do NOT include the email key at all if body.email is empty.
     * This prevents MongoDB from trying to store multiple "null" emails.
     */
    const userData: Prisma.UserCreateInput = {
      name: body.name,
      username: body.username,
      password: hashedPassword,
      avatar: body.avatar || null,
      type: "CHILD",
      family: { connect: { id: familyId } },
    };

    if (body.email && body.email.trim() !== "") {
      userData.email = body.email;
    }

    // 6. Create the child user
    const child = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        type: true,
        createdAt: true,
      },
    });

    return NextResponse.json(child, { status: 201 });

  } catch (error) {
    console.error("Error creating child:", error);

    // 7. Handle unique constraint violation (P2002)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // In MongoDB, target is often a string like "User_email_key"
        const target = (error.meta?.target as string) || "";
        
        let fieldName = "Field";
        if (target.includes("email")) fieldName = "Email";
        if (target.includes("username")) fieldName = "Username";

        return NextResponse.json(
          { error: `${fieldName} already exists` },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}