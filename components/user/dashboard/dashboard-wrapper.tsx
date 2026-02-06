"use client";

import { DashboardHeader } from "@/components/user/dashboard/dashboard-header";
import { CurrentProjects } from "@/components/user/dashboard/current-projects";
import { useStudent } from "@/context/student-context";
import StudentWelcome from "./student-welcome";
import AiAssistant from "../assistant/ai-assistant";

export default function DashboardWrapper() {
  const { name, isLoading } = useStudent();

  return (
    <div className="flex  flex-col  bg-background">
      <DashboardHeader name={name}/>
      <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8 pb-20">
        <StudentWelcome />
        <CurrentProjects />
        <AiAssistant />
      </main>
   
    </div>
  );
}
