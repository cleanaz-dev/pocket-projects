"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
// Assuming you generate types or have a shared types file. 
// If not, I have defined the necessary shapes below based on your schema.
import { Project, Rewards, User } from "@/lib/generated/prisma/client"; 

// 1. Define the shape of the full student profile (User + Relations)
// We extend the User type to include the relations we need
export interface StudentProfile extends User {
  projects: Project[];
  rewards: Rewards | null;
}

interface StudentContextType {
  // Identifiers
  studentId: string;
  familyId: string;
  
  // Profile Info
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  color: string | null;
  
  // Data Relations
  projects: Project[];
  rewards: Rewards | null;
  
  // State
  isLoading: boolean;
  isError: boolean;
  
  // Actions
  refreshStudent: KeyedMutator<StudentProfile>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StudentProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as any; // Type assertion based on your next-auth setup
  const studentId = user?.id;

  // 2. Fetch the specific student data including projects and rewards
  // We condition this on studentId existing to avoid 404s/bad requests
  const { 
    data: studentData, 
    isLoading, 
    error, 
    mutate 
  } = useSWR<StudentProfile>(
    studentId ? `/api/student/${studentId}` : null,
    fetcher
  );

  // 3. Construct the context value
  // Using useMemo prevents unnecessary re-renders in children
  const value: StudentContextType = useMemo(() => {
    return {
      studentId: studentId || "",
      familyId: user?.familyId || "",
      
      // Fallback to session data if SWR is loading, or empty string/null
      name: studentData?.name || user?.name || "",
      username: studentData?.username || "",
      email: studentData?.email || user?.email || "",
      avatar: studentData?.avatar || null,
      color: studentData?.color || null,
      
      // Relations (Default to empty arrays/null to prevent UI crashes)
      projects: studentData?.projects || [],
      rewards: studentData?.rewards || null,
      
      isLoading: isLoading,
      isError: !!error,
      refreshStudent: mutate,
    };
  }, [studentId, user, studentData, isLoading, error, mutate]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

// 4. Custom Hook
export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
}