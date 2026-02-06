"use client"

import { 
  Bot, 
  Search, 
  Sparkles, 
  Mic, 
  Zap, 
  ChevronDown,
  Settings2,
  Brain,
  Smile,
  Flame,
  Check
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AiChatSheet } from "./ai-chat-sheet"
import { cn } from "@/lib/utils"
import { useStudent } from "@/context/student-context"

// Define our personalities with specific styling/icons
const PERSONALITIES = [
  {
    id: "guru",
    name: "Tech Guru",
    description: "Wise, calm, and highly technical.",
    icon: Brain,
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    id: "friend",
    name: "Funny Friend",
    description: "Casual, makes jokes, keeps it light.",
    icon: Smile,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "parent",
    name: "Angry Parent",
    description: "Strict, demanding, and disappointed.",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
]

export default function AiAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState(PERSONALITIES[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { studentId } = useStudent() 
  
  // Close dropdown when clicking outside
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <section className="relative w-full max-w-2xl mx-auto">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gradient-to-tr from-violet-500/5 via-fuchsia-500/5 to-transparent blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col gap-6">
          
          {/* TOP: AI Configuration & Controls */}
          <div className="flex items-center justify-between px-1">
            
            {/* Left: Avatar & Personality Selector */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex cursor-pointer items-center gap-3 rounded-xl p-1 pr-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
              >
                {/* Dynamic Avatar based on Personality */}
                <div className="relative">
                  <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 transition-colors",
                    selectedPersona.bg
                  )}>
                    <selectedPersona.icon className={cn("h-6 w-6", selectedPersona.color)} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-400">Current Mode</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedPersona.name}
                    </span>
                    <ChevronDown className={cn(
                      "h-3 w-3 text-zinc-400 transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )} />
                  </div>
                </div>
              </div>

              {/* Custom Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/50"
                  >
                    <div className="px-2 py-1.5 text-xs font-semibold text-zinc-400">
                      Select Personality
                    </div>
                    {PERSONALITIES.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          setSelectedPersona(persona)
                          setIsDropdownOpen(false)
                        }}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                          selectedPersona.id === persona.id && "bg-zinc-50 dark:bg-zinc-900"
                        )}
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800", persona.color)}>
                          <persona.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {persona.name}
                            </span>
                            {selectedPersona.id === persona.id && (
                              <Check className="h-3.5 w-3.5 text-violet-600" />
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                            {persona.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Controls (Voice & Settings) */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={cn(
                  "group relative flex h-9 items-center gap-2 rounded-full border px-3 transition-all",
                  voiceEnabled 
                    ? "border-violet-500/30 bg-violet-500/10 text-violet-600" 
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                )}
              >
                <Mic className={cn("h-4 w-4", voiceEnabled && "animate-pulse")} />
                <span className="text-xs font-medium">Voice</span>
                {voiceEnabled && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-violet-500/20" />
                )}
              </button>
              
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 transition-all hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* MIDDLE: Input Trigger */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsChatOpen(true)}
            className="cursor-pointer group relative flex w-full flex-col gap-2 rounded-2xl bg-white border border-zinc-200 p-1.5 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black/20"
          >
            <div className="relative flex items-center gap-4 rounded-xl bg-zinc-50 px-4 py-4 transition-colors group-hover:bg-zinc-100 dark:bg-zinc-950 dark:group-hover:bg-zinc-900/50">
              <Search className="h-6 w-6 text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400" />
              
              <div className="flex flex-1 flex-col justify-center">
                <span className="text-lg font-medium text-zinc-500 group-hover:text-zinc-800 transition-colors dark:text-zinc-400 dark:group-hover:text-zinc-200">
                  Ask {selectedPersona.name}...
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-400 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM: Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-zinc-400 mr-2">Try asking:</span>
            
            {["Summarize this page", "Generate citation", "Explain like I'm 5"].map((prompt, i) => (
              <motion.button
                key={prompt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setIsChatOpen(true)}
                className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-violet-900 dark:hover:bg-violet-900/20 dark:hover:text-violet-300"
              >
                {prompt}
                <Zap className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>

        </div>
      </section>

      {/* The Chat Sheet - Now receives the persona */}
      <AiChatSheet 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen} 
        persona={selectedPersona}
        userId={studentId} 
      />
    </>
  )
}