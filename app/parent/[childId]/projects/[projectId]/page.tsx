import { checkChildExisit } from "@/lib/prisma/query/check-child-exist";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{
    childId: string;
    projectId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { childId, projectId } = await params;
  const childExist = await checkChildExisit(childId);

  if (!childExist || !projectId) return notFound();

  return <div>Projects Page: {projectId}</div>;
}
