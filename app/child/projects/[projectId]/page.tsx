import SingleProjectWrapper from "@/components/user/project/single-project-wrapper";
import { checkProjectExist } from "@/lib/prisma/query/check-project-exist";
import { notFound } from "next/navigation";

interface Params {
    params: Promise<{
        projectId: string;
    }>
}

export default async function Page({params}: Params) {
    const { projectId } = await params

    const projectExist = await checkProjectExist(projectId)

    if(!projectExist) return notFound()

    // ✅ Pass projectId (string), not projectExist (boolean)
    return <div><SingleProjectWrapper projectId={projectId} /></div>
}