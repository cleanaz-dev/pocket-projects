"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColorGradient } from "@/lib/utils"; // Your utils file
// Import your types appropriately
import { Project, User } from "@/lib/generated/prisma/client";
import Link from "next/link";

// Helper type if Prisma types aren't fully available in client component directly
type ProjectWithRelations = any; // Replace with your actual type, e.g., Project & { owner: User, researches: any[], notes: any[] }

interface RecentProjectsProps {
  projects: ProjectWithRelations[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No active projects found. Start one today!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, idx) => (
        <div
          key={project.id}
          className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl"
          style={{
            animationDelay: `${idx * 100}ms`,
          }}
        >
          <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">
            {/* Project Icon with Dynamic Gradient */}
            <div
              className={`
                relative flex h-24 w-24 flex-shrink-0 items-center justify-center 
                rounded-2xl shadow-xl animate-float text-5xl
                bg-gradient-to-br ${getColorGradient(project.color)} 
              `}
            >
              {project.coverImage}
              {project.status === "IN_PROGRESS" && (
                <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-emerald-400 animate-pulse-glow border-2 border-white" />
              )}
            </div>

            {/* Project Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl text-gray-900 lg:text-3xl">
                  {project.name}
                </h3>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                    project.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {project.status === "COMPLETED" ? "✓ DONE" : "• IN PROGRESS"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
                <span className="flex items-center gap-2">
                   {/* Handle optional chaining just in case */}
                  <span className="text-lg">{project.owner?.type || "UNK"}</span>
                  {project.owner?.name?.toUpperCase() || "USER"}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                  {project.category || "General"}
                </span>
                {project.dueDate && (
                    <span>📅 {new Date(project.dueDate).toLocaleDateString()}</span>
                )}
                <span>🔬 {project.researches?.length || 0} topics</span>
                <span>📝 {project.notes?.length || 0} notes</span>
              </div>
            </div>

            {/* Action Button */}
            <Button className="rounded-2xl bg-gray-900 px-8 py-6 font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105 lg:flex-shrink-0 cursor-pointer">
              <Link
                href={`/parent/${project.owner.id}/projects/${project.id}`}
                className="flex gap-2 items-center"
              >
               View Details
              <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
             
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}