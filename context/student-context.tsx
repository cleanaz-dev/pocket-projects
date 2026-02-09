"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR, { KeyedMutator } from "swr";
import { Project, Rewards, User } from "@/lib/generated/prisma/client";
import { getImageUrl } from "@/lib/utils";

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
  
  // Utilities
  getImageUrl: (key: string | null | undefined) => string;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StudentProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const studentId = user?.id;

  const { 
    data: studentData, 
    isLoading, 
    error, 
    mutate 
  } = useSWR<StudentProfile>(
    studentId ? `/api/student/${studentId}` : null,
    fetcher
  );

  const value: StudentContextType = useMemo(() => {
    return {
      studentId: studentId || "",
      familyId: user?.familyId || "",
      
      name: studentData?.name || user?.name || "",
      username: studentData?.username || "",
      email: studentData?.email || user?.email || "",
      avatar: studentData?.avatar || null,
      color: studentData?.color || null,
      
      projects: studentData?.projects || [],
      rewards: studentData?.rewards || null,
      
      isLoading: isLoading,
      isError: !!error,
      refreshStudent: mutate,
      
      // Add the utility function
      getImageUrl,
    };
  }, [studentId, user, studentData, isLoading, error, mutate]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within StudentProvider");
  }
  return context;
}