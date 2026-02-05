import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/config"

interface Params {
    params: Promise<{
        familyId: string
    }>
}

export async function GET(req: Request, { params }: Params) {
    const { familyId } = await params

    if (!familyId) {
        return NextResponse.json(
            { error: "Family ID is required" },
            { status: 400 }
        )
    }

    try {
        const family = await prisma.family.findUnique({
            where: { id: familyId },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        type: true,
                        avatar: true, // Make sure to select this
                        color: true,  // Make sure to select this
                        createdAt: true,
                        // Fetch the projects for this specific user to calculate stats
                        projects: {
                            select: {
                                status: true
                            }
                        }
                    }
                },
                projects: {
                    // ... your existing project includes (owner, researches, etc)
                    include: {
                         owner: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                avatar: true,
                                // rewards: true, // Careful: rewards is a relation, usually you need rewards: { select: ... } or include
                                username: true,
                            }
                        },
                        researches: true,
                        notes: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!family) {
            return NextResponse.json(
                { error: "Family not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(family)
        
    } catch (error) {
        console.error("Error fetching family:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}