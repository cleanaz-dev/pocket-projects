import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Pocket Projects",
  description: "Your creative workspace for academic research projects",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
