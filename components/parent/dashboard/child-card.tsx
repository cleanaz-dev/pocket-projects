"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getColorGradient } from "@/lib/utils";

// Define the interface based on your data structure
interface ChildData {
  id: string;
  name: string;
  avatar: string; // Emoji or URL
  color: string; // e.g., "from-pink-400 to-rose-500" or just "pink" if using utils
  activeProjects: number;
  completedProjects: number;
}

interface ChildCardProps {
  child: ChildData;
  index: number;
}

export function ChildCard({ child, index }: ChildCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background Glow */}
      <div
        className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${getColorGradient(child.color)} opacity-10 blur-3xl transition-all group-hover:scale-150`}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${getColorGradient(child.color)} text-4xl shadow-lg animate-float`}
          >
            {child.avatar}
          </div>
          <div>
            <h3 className="font-display text-2xl text-gray-900">
              {child.name}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              Young Researcher
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
            <div className="font-display text-3xl text-gray-900">
              {child.activeProjects}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Active
            </div>
          </div>
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 p-4 text-center">
            <div className="font-display text-3xl text-emerald-700">
              {child.completedProjects}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Done
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="ghost"
          asChild
          className="mt-4 w-full justify-between rounded-xl bg-gray-50 py-6 font-semibold text-gray-700 transition-all hover:bg-gray-100 cursor-pointer"
        >
          <Link href={`/parent/${child.id}`}>
            View 
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}