"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Sparkles } from "lucide-react"
import { useParent } from "@/context/parent-context"

const PROJECT_EMOJIS = [
  { emoji: "🌋", label: "Volcano", color: "from-orange-400 to-red-500" },
  { emoji: "🏛️", label: "History", color: "from-amber-400 to-yellow-600" },
  { emoji: "🪐", label: "Space", color: "from-purple-400 to-indigo-500" },
  { emoji: "🦕", label: "Dinosaurs", color: "from-green-400 to-emerald-600" },
  { emoji: "🌊", label: "Ocean", color: "from-blue-400 to-cyan-500" },
  { emoji: "🔬", label: "Science", color: "from-pink-400 to-rose-500" },
  { emoji: "🎨", label: "Art", color: "from-fuchsia-400 to-purple-500" },
  { emoji: "📚", label: "Literature", color: "from-indigo-400 to-blue-500" },
]

const CATEGORIES = [
  "Social Media",
  "AI",
  "Coding",
  "Nutrition",
  "Hobbies"
]

const GRADES = [
  "Primary",
  "Secondary",
  "High School",
]

interface NewProjectDialogProps {
  trigger?: React.ReactNode
}

export function NewProjectDialog({ trigger }: NewProjectDialogProps) {
  const { family, familyId } = useParent()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(PROJECT_EMOJIS[0])
  const [selectedChild, setSelectedChild] = useState("")
  const [category, setCategory] = useState("")
  const [grade, setGrade] = useState("")
  const [dueDate, setDueDate] = useState("")

  const children = family?.users.filter(user => user.type === "CHILD") || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/family/${familyId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          coverImage: selectedEmoji.emoji,
          ownerId: selectedChild,
          category,
          grade,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to create project")

      // Reset form and close dialog
      setName("")
      setDescription("")
      setSelectedEmoji(PROJECT_EMOJIS[0])
      setSelectedChild("")
      setCategory("")
      setGrade("")
      setDueDate("")
      setOpen(false)

      // Refresh the page or mutate SWR data
      window.location.reload()
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Failed to create project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button 
      className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
    >
      <span className="relative z-10 flex items-center gap-2">
        <Plus className="h-5 w-5" />
        New Project
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="font-body max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-gray-900" style={{ 
            textShadow: '2px 2px 0px rgba(251, 146, 60, 0.2)'
          }}>
            <Sparkles className="mr-2 inline h-8 w-8 text-amber-500" />
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-gray-700">
              Project Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., How Volcanoes Erupt"
              required
              className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base focus:border-orange-400"
            />
          </div>

          {/* Emoji Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              Choose a Project Icon
            </Label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {PROJECT_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(item)}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all hover:scale-110 ${
                    selectedEmoji.emoji === item.emoji
                      ? `bg-gradient-to-br ${item.color} shadow-lg scale-110`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Assign to Child */}
          <div className="space-y-2">
            <Label htmlFor="child" className="text-base font-semibold text-gray-700">
              Assign to Child
            </Label>
            <Select value={selectedChild} onValueChange={setSelectedChild} required>
              <SelectTrigger className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id} className="text-base">
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category and Grade */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold text-gray-700">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-base">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-base font-semibold text-gray-700">
                Grade Level
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g} className="text-base">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-base font-semibold text-gray-700">
              Due Date (Optional)
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base focus:border-orange-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this project be about?"
              rows={4}
              className="rounded-xl border-2 border-gray-200 px-4 py-3 text-base focus:border-orange-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-2 py-6 text-base font-semibold"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}