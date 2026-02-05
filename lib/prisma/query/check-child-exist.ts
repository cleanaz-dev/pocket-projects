"use server";
import { UserType } from "@/lib/generated/prisma/enums";
import { prisma } from "../config";

export async function checkChildExisit(childId: string) {
  if (!childId) return false;
  try {
    const child = await prisma.user.findFirst({
      where: {
        id: childId,
        type: UserType.CHILD,
      },
    });

    console.log("child:", child)

    return !!child;
  } catch (error) {
    console.error("Error checking child existence:", error);
    return false;
  }
}
