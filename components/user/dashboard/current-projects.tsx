"use client"

import Image from "next/image"
import { Play, Clock, Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function CurrentProjects() {
  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Current Project</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          View All Projects
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="group relative flex h-full max-h-[400px] overflow-hidden rounded-3xl bg-card border border-border shadow-sm">
        {/* Large Project Visual */}
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src="/project-volcano.jpg"
            alt="Volcano Science Project"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary">
              <Play className="h-7 w-7 ml-1" fill="currentColor" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              In Progress
            </span>
          </div>
        </div>

        {/* Project Details */}
        <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground">
                Science
              </span>
              <span className="rounded-full bg-accent/50 px-3 py-1 text-xs font-medium text-accent-foreground">
                Grade 4
              </span>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl text-balance">
              How Volcanoes Erupt
            </h3>

            <p className="mb-4 text-muted-foreground leading-relaxed">
              Discover the amazing science behind volcanic eruptions! Build your own volcano model and learn about tectonic plates.
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                3 days left
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                4.8 rating
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progress</span>
                <span className="text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-3 bg-muted" />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Continue Working
              </Button>
              <Button variant="outline" className="rounded-full border-border bg-transparent">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
