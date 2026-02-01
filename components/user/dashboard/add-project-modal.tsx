"use client"

import React from "react"

import { useState, createContext, useContext } from "react"
import { X, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type ProjectModalContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ProjectModalContext = createContext<ProjectModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})

export function useProjectModal() {
  return useContext(ProjectModalContext)
}

export function AddProjectModal({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setProjectName("")
    setProjectDescription("")
    setSelectedSubject("")
    setPreviewImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const subjects = ["Science", "Math", "History", "Art", "Geography", "Literature"]

  return (
    <ProjectModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg mx-4 rounded-3xl bg-card p-6 shadow-xl border border-border">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-foreground">Create New Project</h2>

            <div className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Project Cover Image
                </label>
                <div className="relative">
                  {previewImage ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-border">
                      <Image
                        src={previewImage || "/placeholder.svg"}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute right-2 top-2 rounded-full bg-card/90 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-card"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Drop an image or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Why Do Leaves Change Color?"
                  className="h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Subject Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Subject
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedSubject === subject
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  What will you discover?
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your research question or what you want to learn..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1 rounded-full border-border bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={closeModal}
                  className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProjectModalContext.Provider>
  )
}
