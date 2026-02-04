import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username")

    if (!username) {
        return NextResponse.json(
            { error: "Username is required" },
            { status: 400 }
        )
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
            select: { id: true }
        })

        return NextResponse.json({
            available: !existingUser,
            username
        })

    } catch (error) {
        console.error("Error checking username:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}