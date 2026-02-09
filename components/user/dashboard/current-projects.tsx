"use client"

import Image from "next/image"
import { Play, Clock, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Project } from "@/lib/generated/prisma/client"
import { useStudent } from "@/context/student-context"
import Link from "next/link"

interface CurrentProjectsProps {
  projects?: Project[]
  isLoading?: boolean
}

export function CurrentProjects({ projects = [], isLoading }: CurrentProjectsProps) {
  const { getImageUrl } = useStudent() // Get it from context
  
  if (isLoading) {
    return (
      <section className="flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Current Projects</h2>
        </div>
        <div className="rounded-3xl bg-card border border-border p-8 text-center">
          Loading projects...
        </div>
      </section>
    )
  }
  
  if (!projects || projects.length === 0) {
    return (
      <section className="flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Current Projects</h2>
        </div>
        <div className="rounded-3xl bg-card border border-border p-8 text-center">
          <p className="text-muted-foreground">No projects yet. Start your first project!</p>
        </div>
      </section>
    )
  }

  const currentProject = projects[0]

  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Current Project {projects.length > 1 && `(${projects.length} total)`}
        </h2>
        {projects.length > 1 && (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All Projects
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="group relative flex h-full max-h-[400px] overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
        {/* Large Project Visual */}
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src={getImageUrl(currentProject.coverImage)}
            alt={currentProject.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
          
          {/* Play Button Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary">
              <Play className="h-7 w-7 ml-1" fill="currentColor" />
            </button>
          </div> */}

          {/* Status Badge */}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                currentProject.status === 'DRAFT' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              {currentProject.status === 'DRAFT' ? 'Draft' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {currentProject.category && (
                <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {currentProject.category}
                </span>
              )}
              {currentProject.grade && (
                <span className="rounded-full bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
                  {currentProject.grade}
                </span>
              )}
            </div>

            <h3 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl text-balance">
              {currentProject.name}
            </h3>

            <p className="mb-4 text-muted-foreground leading-relaxed line-clamp-3">
              {currentProject.description || "No description available"}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {currentProject.dueDate && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {new Date(currentProject.dueDate).toLocaleDateString()}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                New Project
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progress</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-3 bg-muted" />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link 
                href={`/child/projects/${currentProject.id}`}
              >
              Work on Project
              </Link>
                
              </Button>
         
            </div>
          </div>
        </div>
      </div>

      {/* Additional Projects */}
      {projects.length > 1 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(1, 3).map((project) => (
            <div key={project.id} className="rounded-xl bg-card border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(project.coverImage)}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{project.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {project.category && (
                      <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}