import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/config"

interface Params {
    params: Promise<{
        familyId: string
    }>
}

interface CreateProjectBody {
    name: string
    description?: string
    coverImage?: string
    ownerId: string
    category?: string
    grade?: string
    dueDate?: string | null
}

export async function POST(req: Request, { params }: Params) {
    const { familyId } = await params

    if (!familyId) {
        return NextResponse.json(
            { error: "Family ID is required" },
            { status: 400 }
        )
    }

    try {
        const body: CreateProjectBody = await req.json()

        // Validate required fields
        if (!body.name || !body.ownerId) {
            return NextResponse.json(
                { error: "Project name and owner ID are required" },
                { status: 400 }
            )
        }

        // Verify the owner exists and belongs to this family
        const owner = await prisma.user.findUnique({
            where: { id: body.ownerId }
        })

        if (!owner || owner.familyId !== familyId) {
            return NextResponse.json(
                { error: "Invalid owner ID or owner does not belong to this family" },
                { status: 400 }
            )
        }

        // Create the project
        const project = await prisma.project.create({
            data: {
                name: body.name,
                description: body.description || null,
                coverImage: body.coverImage || null,
                category: body.category || null,
                grade: body.grade || null,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                status: "DRAFT",
                familyId: familyId,
                ownerId: body.ownerId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    }
                },
                researches: true,
                notes: true,
            }
        })

        return NextResponse.json(project, { status: 201 })

    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}