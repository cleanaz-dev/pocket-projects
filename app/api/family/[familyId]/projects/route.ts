import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/config"
import { SaveProjectImage } from "@/lib/aws" // <--- Import your S3 helper

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

        // 1. Create the project first (using the temporary AI URL or null initially)
        // We use 'let' because we might update it with the S3 URL immediately after
        let project = await prisma.project.create({
            data: {
                name: body.name,
                description: body.description || null,
                coverImage: body.coverImage || null, // Temporary AI URL goes here
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

        // 2. If there is a cover image (AI URL), save it to S3 and update the record
        if (body.coverImage) {
            try {
                // Upload to S3
                const s3Url = await SaveProjectImage(body.coverImage, familyId, project.id)

                // Update the project record with the permanent S3 URL
                project = await prisma.project.update({
                    where: { id: project.id },
                    data: { coverImage: s3Url },
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
            } catch (imageError) {
                console.error("Failed to save image to S3:", imageError)
                // We don't throw an error here because we don't want to fail the 
                // whole request if just the image upload fails. 
                // The project will still exist with the temporary URL.
            }
        }

        return NextResponse.json(project, { status: 201 })

    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}