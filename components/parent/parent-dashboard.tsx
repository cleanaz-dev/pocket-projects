"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./new-project-dialog";
import { AddChildDialog } from "./add-chilld-dialog";
import { useParent } from "@/context/parent-context";

// Import new components
import { ChildCard } from "@/components/parent/dashboard/child-card";
import { StatCards } from "./dashboard/stat-cards";
import { RecentProjects } from "@/components/parent/dashboard/recent-projects";
import Link from "next/link";

export function ParentDashboard() {
  const { family, isLoadingFamily } = useParent();


  if (isLoadingFamily) {
    return <div className="p-8 text-center">Loading family data...</div>;
  }

  
  // Dummy data for children (until you pull this from family.users)
  const children = family?.users
    .filter((user) => user.type === "CHILD") // Only show children
    .map((child) => {
      // Calculate stats based on the projects array we fetched in the API
      const activeCount = child.projects.filter(
        (p) => p.status === "IN_PROGRESS" || p.status === "DRAFT"
      ).length;

      const completedCount = child.projects.filter(
        (p) => p.status === "COMPLETED"
      ).length;

      return {
        id: child.id,
        name: child.name,
        // Use database avatar/color, fallback if missing
        avatar: child.avatar || "👤", 
        color: child.color || "blue", 
        activeProjects: activeCount,
        completedProjects: completedCount,
      };
    }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 sm:p-6 lg:p-8">
      {/* Global styles for animations & fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Righteous&family=Outfit:wght@400;500;600;700&display=swap");
        .font-display { font-family: "Righteous", cursive; }
        .font-body { font-family: "Outfit", sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.6); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl font-body">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="font-display text-4xl text-gray-900 sm:text-5xl lg:text-6xl"
              style={{ textShadow: "3px 3px 0px rgba(251, 146, 60, 0.3)" }}
            >
              {family?.name || "Family"} Projects
            </h1>
            <p className="mt-2 text-lg text-gray-600 font-medium">
              Nurture curiosity, celebrate discoveries ✨
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddChildDialog />
            <NewProjectDialog />
          </div>
        </div>

        {/* Children Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {children.map((child, idx) => (
            <ChildCard key={child.id} child={child} index={idx} />
          ))}
        </div>

        {/* Stats Grid */}
        <StatCards />

        {/* Recent Projects */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl text-gray-900">
              Recent Projects
            </h2>
            <Button
              variant="ghost"
              className="font-semibold text-gray-600 hover:text-gray-900"
            >
              <Link
                href="/parent/projects"
                className="flex gap-2 items-center"
              >
               View All
              <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
             
            </Button>
          </div>
          
          {/* Use the new component */}
          <RecentProjects projects={family?.projects || []} />
        </div>
      </div>
    </div>
  );
}