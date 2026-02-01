import { DashboardHeader } from "@/components/user/dashboard/dashboard-header"
import { CurrentProject } from "@/components/user/dashboard/current-project"
import { ProjectTools } from "@/components/user/dashboard/project-tools"
import { AddProjectModal } from "@/components/user/dashboard/add-project-modal"

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
        <CurrentProject />
        <ProjectTools />
      </main>
      <AddProjectModal />
    </div>
  )
}
