// app/api/family/[familyId]/projects/[projectId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  params: Promise<{
    familyId: string;
    projectId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { familyId, projectId } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        researches: {
          include: {
            webLinks: true,
            ytLinks: true,
            imgLinks: true,
          },
        },
        notes: {
          orderBy: {
            updatedAt: "desc",
          },
        },
        chats: {
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify the project belongs to this family
    if (project.familyId !== familyId) {
      return NextResponse.json(
        { error: "Project does not belong to this family" },
        { status: 403 },
      );
    }

    // Verify user is part of this family
    if ((session.user as any).familyId !== familyId) {
      return NextResponse.json(
        { error: "You are not part of this family" },
        { status: 403 },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
