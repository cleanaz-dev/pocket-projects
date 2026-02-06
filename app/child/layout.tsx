import React from "react";
import type { Metadata } from "next";
import { StudentProvider } from "@/context/student-context";

export const metadata: Metadata = {
  title: "Dashboard - Pocket Projects",
  description: "Your creative workspace for academic research projects",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudentProvider>{children}</StudentProvider>
    </>
  );
}
