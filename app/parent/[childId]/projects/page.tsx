import { checkChildExisit } from "@/lib/prisma/query/check-child-exist";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{
    childId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { childId } = await params;
  const childExist = await checkChildExisit(childId);

  if (!childExist) return notFound();

  return <div>Child Page</div>;
}
