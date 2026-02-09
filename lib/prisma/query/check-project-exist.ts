"use server";
import { prisma } from "../config";

export async function checkProjectExist(projectId: string) {
  if (!projectId) return false;
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        ownerId: true,
      }
    });
    return !!project;
  } catch (error) {
    console.error("Error checking child existence:", error);
    return false;
  }
}
