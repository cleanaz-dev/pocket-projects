"use client"

import {
  BookOpen,
  Microscope,
  PenTool,
  Camera,
  MessageCircle,
  Sparkles,
  Plus,
} from "lucide-react"
import { useProjectModal } from "./add-project-modal"

const tools = [
  {
    icon: BookOpen,
    label: "Research",
    description: "Find facts",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: Microscope,
    label: "Experiment",
    description: "Try things",
    color: "bg-secondary/30 text-secondary-foreground",
  },
  {
    icon: PenTool,
    label: "Write",
    description: "Take notes",
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    icon: Camera,
    label: "Capture",
    description: "Add photos",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: MessageCircle,
    label: "Ask AI",
    description: "Get help",
    color: "bg-secondary/30 text-secondary-foreground",
  },
  {
    icon: Sparkles,
    label: "Present",
    description: "Show off",
    color: "bg-accent/30 text-accent-foreground",
  },
]

export function ProjectTools() {
  const { openModal } = useProjectModal()

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Project Tools</h2>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md lg:p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110 lg:h-14 lg:w-14`}
            >
              <tool.icon className="h-6 w-6 lg:h-7 lg:w-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{tool.label}</p>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
