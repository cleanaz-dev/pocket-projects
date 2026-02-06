"use client"

import {
  Link as LinkIcon,
  Youtube,
  Image as ImageIcon,
  FileText,
} from "lucide-react"
import { useState } from "react"
import { AddWebLinkModal } from "@/components/user/tools/add-web-links"
import { AddYtLinkModal } from "@/components/user/tools/add-yt-links"
import { AddImgModal } from "@/components/user/tools/add-img"
import { AddNoteModal } from "@/components/user/tools/add-note"

const tools = [
  {
    icon: LinkIcon,
    label: "Web Link",
    description: "Add websites",
    color: "bg-blue-500/20 text-blue-600",
    modal: "web",
  },
  {
    icon: Youtube,
    label: "YouTube",
    description: "Add videos",
    color: "bg-red-500/20 text-red-600",
    modal: "youtube",
  },
  {
    icon: ImageIcon,
    label: "Image",
    description: "Add photos",
    color: "bg-purple-500/20 text-purple-600",
    modal: "image",
  },
  {
    icon: FileText,
    label: "Note",
    description: "Write notes",
    color: "bg-green-500/20 text-green-600",
    modal: "note",
  },
]

export function ProjectTools() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Project Tools</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {tools.map((tool) => (
          <button
            key={tool.label}
            onClick={() => setActiveModal(tool.modal)}
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

      <AddWebLinkModal 
        open={activeModal === "web"} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
      <AddYtLinkModal 
        open={activeModal === "youtube"} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
      <AddImgModal 
        open={activeModal === "image"} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
      <AddNoteModal 
        open={activeModal === "note"} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
    </section>
  )
}