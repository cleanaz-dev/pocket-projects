"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Sparkles, Check, X, Loader2 } from "lucide-react"
import { useParent } from "@/context/parent-context"
import { useCheckUsername } from "@/hooks/use-check-username"

const CHILD_AVATARS = [
  { emoji: "🌸", label: "Flower", color: "from-pink-400 to-rose-500" },
  { emoji: "🚀", label: "Rocket", color: "from-blue-400 to-indigo-500" },
  { emoji: "🌟", label: "Star", color: "from-amber-400 to-yellow-500" },
  { emoji: "🦄", label: "Unicorn", color: "from-purple-400 to-pink-500" },
  { emoji: "🐉", label: "Dragon", color: "from-red-400 to-orange-500" },
  { emoji: "🎨", label: "Art", color: "from-fuchsia-400 to-purple-500" },
  { emoji: "⚡", label: "Lightning", color: "from-yellow-400 to-orange-500" },
  { emoji: "🌈", label: "Rainbow", color: "from-cyan-400 to-blue-500" },
  { emoji: "🦋", label: "Butterfly", color: "from-violet-400 to-purple-500" },
  { emoji: "🎭", label: "Drama", color: "from-indigo-400 to-purple-500" },
  { emoji: "🎪", label: "Circus", color: "from-rose-400 to-pink-500" },
  { emoji: "🎯", label: "Target", color: "from-red-400 to-rose-500" },
  { emoji: "🎮", label: "Gaming", color: "from-green-400 to-emerald-500" },
  { emoji: "🎸", label: "Guitar", color: "from-orange-400 to-red-500" },
  { emoji: "🎺", label: "Trumpet", color: "from-yellow-400 to-amber-500" },
  { emoji: "🏀", label: "Basketball", color: "from-orange-400 to-amber-500" },
  { emoji: "⚽", label: "Soccer", color: "from-green-400 to-teal-500" },
  { emoji: "🎓", label: "Graduate", color: "from-blue-400 to-cyan-500" },
  { emoji: "📚", label: "Books", color: "from-indigo-400 to-blue-500" },
  { emoji: "🔭", label: "Telescope", color: "from-purple-400 to-indigo-500" },
]

interface AddChildDialogProps {
  trigger?: React.ReactNode
}

export function AddChildDialog({ trigger }: AddChildDialogProps) {
  const { familyId } = useParent()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(CHILD_AVATARS[0])

  // Check username availability
  const { isChecking, isAvailable, error: usernameError } = useCheckUsername(username)

  // Auto-generate username suggestion from name
  const handleNameChange = (newName: string) => {
    setName(newName)
    // Generate username suggestion: lowercase, remove spaces, add underscore
    const suggestion = newName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    if (suggestion && !username) {
      setUsername(suggestion)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate username availability
    if (!isAvailable) {
      alert("Please choose an available username")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/family/${familyId}/children`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          email: email || null,
          password: password || null,
          avatar: selectedAvatar.emoji,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add child")
      }

      // Reset form and close dialog
      setName("")
      setUsername("")
      setEmail("")
      setPassword("")
      setSelectedAvatar(CHILD_AVATARS[0])
      setOpen(false)

      // Refresh the page or mutate SWR data
      window.location.reload()
    } catch (error: any) {
      console.error("Error adding child:", error)
      alert(error.message || "Failed to add child. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button 
      className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
    >
      <span className="relative z-10 flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        Add Child
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </Button>
  )

  // Determine if form can be submitted
  const canSubmit = name && username && password && isAvailable && !isChecking

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="font-body max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-gray-900" style={{ 
            textShadow: '2px 2px 0px rgba(59, 130, 246, 0.2)'
          }}>
            <Sparkles className="mr-2 inline h-8 w-8 text-blue-500" />
            Add New Child
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Child Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold text-gray-700">
              Child's Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Emma"
              required
              className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base focus:border-blue-400"
            />
          </div>

          {/* Username with availability check */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-base font-semibold text-gray-700">
              Username (for login)
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g., emma_smith"
                required
                className="rounded-xl border-2 border-gray-200 px-4 py-6 pr-12 text-base focus:border-blue-400"
              />
              {/* Status indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isChecking && username.length >= 3 && (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                )}
                {!isChecking && username.length >= 3 && isAvailable === true && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                )}
                {!isChecking && username.length >= 3 && isAvailable === false && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                )}
              </div>
            </div>
            {/* Status messages */}
            {username.length >= 3 && !isChecking && isAvailable === true && (
              <p className="text-xs text-emerald-600 font-medium">
                ✓ Username is available
              </p>
            )}
            {username.length >= 3 && !isChecking && isAvailable === false && (
              <p className="text-xs text-red-600 font-medium">
                ✗ Username is already taken
              </p>
            )}
            {usernameError && (
              <p className="text-xs text-red-600">
                {usernameError}
              </p>
            )}
            {username.length < 3 && username.length > 0 && (
              <p className="text-xs text-gray-500">
                Username must be at least 3 characters
              </p>
            )}
            {!username && (
              <p className="text-xs text-gray-500">
                Child will use this username to log in
              </p>
            )}
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">
              Choose an Avatar
            </Label>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
              {CHILD_AVATARS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(item)}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all hover:scale-110 ${
                    selectedAvatar.emoji === item.emoji
                      ? `bg-gradient-to-br ${item.color} shadow-lg scale-110`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base focus:border-blue-400"
            />
            <p className="text-xs text-gray-500">
              Child will use this password to log in
            </p>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold text-gray-700">
              Email (Optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="child@example.com"
              className="rounded-xl border-2 border-gray-200 px-4 py-6 text-base focus:border-blue-400"
            />
            <p className="text-xs text-gray-500">
              For notifications only (not required for login)
            </p>
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
              disabled={loading || !canSubmit}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Child"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}