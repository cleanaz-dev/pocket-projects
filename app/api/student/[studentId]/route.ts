import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    studentId: string;
  }>;
}
export async function GET(request: Request, { params }: Params) {
  const { studentId } = await params;

  try {
    const student = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
      include: {
        // Essential: Include the projects so the Context has them ready
        projects: {
          orderBy: {
            updatedAt: "desc", // Most recent work first
          },
        },
        // Essential: Include rewards for gamification
        rewards: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
