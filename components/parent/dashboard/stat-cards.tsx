"use client";

import { Sparkles, Star, Clock, TrendingUp } from "lucide-react";

export function StatCards() {
  // You can pass these values in as props later if they come from the DB
  const stats = [
    {
      label: "Active Projects",
      value: "3",
      icon: Sparkles,
      color: "text-amber-500",
      badge: "LIVE",
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      label: "Completed",
      value: "8",
      icon: Star,
      color: "text-emerald-500",
      badge: "+3",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Due This Week",
      value: "2",
      icon: Clock,
      color: "text-rose-500",
      badge: "SOON",
      badgeColor: "bg-rose-100 text-rose-700",
    },
    {
      label: "Avg Progress",
      value: "62%",
      icon: TrendingUp,
      color: "text-blue-500",
      badge: "↑ 12%",
      badgeColor: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${stat.badgeColor}`}
            >
              {stat.badge}
            </span>
          </div>
          <div className="font-display text-4xl text-gray-900">
            {stat.value}
          </div>
          <div className="text-sm font-semibold text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}