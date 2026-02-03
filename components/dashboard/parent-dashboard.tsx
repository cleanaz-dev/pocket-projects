"use client"

import { Plus, Sparkles, TrendingUp, Clock, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ParentDashboard() {
  const children = [
    {
      id: "1",
      name: "Emma",
      avatar: "🌸",
      color: "from-pink-400 to-rose-500",
      activeProjects: 2,
      completedProjects: 5,
    },
    {
      id: "2",
      name: "Lucas",
      avatar: "🚀",
      color: "from-blue-400 to-indigo-500",
      activeProjects: 1,
      completedProjects: 3,
    },
  ]

  const recentProjects = [
    {
      id: "1",
      name: "How Volcanoes Erupt",
      childName: "Emma",
      childAvatar: "🌸",
      status: "IN_PROGRESS",
      progress: 65,
      dueDate: "Feb 6",
      category: "Science",
      emoji: "🌋",
      color: "from-orange-400 to-red-500",
      researchCount: 4,
      noteCount: 8,
    },
    {
      id: "2",
      name: "Ancient Egypt Civilization",
      childName: "Lucas",
      childAvatar: "🚀",
      status: "IN_PROGRESS",
      progress: 30,
      dueDate: "Feb 10",
      category: "History",
      emoji: "🏛️",
      color: "from-amber-400 to-yellow-600",
      researchCount: 2,
      noteCount: 5,
    },
    {
      id: "3",
      name: "Solar System Exploration",
      childName: "Emma",
      childAvatar: "🌸",
      status: "COMPLETED",
      progress: 100,
      dueDate: "Jan 28",
      category: "Science",
      emoji: "🪐",
      color: "from-purple-400 to-indigo-500",
      researchCount: 6,
      noteCount: 12,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 sm:p-6 lg:p-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Outfit:wght@400;500;600;700&display=swap');
        
        .font-display {
          font-family: 'Righteous', cursive;
        }
        
        .font-body {
          font-family: 'Outfit', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.6); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl font-body">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl text-gray-900 sm:text-5xl lg:text-6xl" style={{ 
              textShadow: '3px 3px 0px rgba(251, 146, 60, 0.3)'
            }}>
              Family Projects
            </h1>
            <p className="mt-2 text-lg text-gray-600 font-medium">
              Nurture curiosity, celebrate discoveries ✨
            </p>
          </div>
          <Button 
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Project
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </Button>
        </div>

        {/* Children Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          {children.map((child, idx) => (
            <div
              key={child.id}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${child.color} opacity-10 blur-3xl transition-all group-hover:scale-150`} />
              
              <div className="relative">
                <div className="mb-4 flex items-center gap-4">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${child.color} text-4xl shadow-lg animate-float`}>
                    {child.avatar}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-gray-900">{child.name}</h3>
                    <p className="text-sm font-medium text-gray-500">Young Researcher</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
                    <div className="font-display text-3xl text-gray-900">{child.activeProjects}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">Active</div>
                  </div>
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 p-4 text-center">
                    <div className="font-display text-3xl text-emerald-700">{child.completedProjects}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Done</div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="mt-4 w-full justify-between rounded-xl bg-gray-50 py-6 font-semibold text-gray-700 transition-all hover:bg-gray-100"
                >
                  View All Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <Sparkles className="h-8 w-8 text-amber-500" />
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">LIVE</span>
            </div>
            <div className="font-display text-4xl text-gray-900">3</div>
            <div className="text-sm font-semibold text-gray-600">Active Projects</div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <Star className="h-8 w-8 text-emerald-500" />
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">+3</span>
            </div>
            <div className="font-display text-4xl text-gray-900">8</div>
            <div className="text-sm font-semibold text-gray-600">Completed</div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <Clock className="h-8 w-8 text-rose-500" />
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">SOON</span>
            </div>
            <div className="font-display text-4xl text-gray-900">2</div>
            <div className="text-sm font-semibold text-gray-600">Due This Week</div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">↑ 12%</span>
            </div>
            <div className="font-display text-4xl text-gray-900">62%</div>
            <div className="text-sm font-semibold text-gray-600">Avg Progress</div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl text-gray-900">Recent Projects</h2>
            <Button variant="ghost" className="font-semibold text-gray-600 hover:text-gray-900">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentProjects.map((project, idx) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl"
                style={{
                  animationDelay: `${idx * 100}ms`,
                }}
              >
                <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">
                  {/* Project Icon */}
                  <div className={`relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${project.color} text-5xl shadow-xl animate-float`}>
                    {project.emoji}
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
                      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                        project.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {project.status === "COMPLETED" ? "✓ DONE" : "• IN PROGRESS"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{project.childAvatar}</span>
                        {project.childName}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                        {project.category}
                      </span>
                      <span>📅 {project.dueDate}</span>
                      <span>🔬 {project.researchCount} topics</span>
                      <span>📝 {project.noteCount} notes</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="rounded-2xl bg-gray-900 px-8 py-6 font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105 lg:flex-shrink-0"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}