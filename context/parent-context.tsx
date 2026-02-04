// app/parent/context/ParentContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Family } from "@/types/family-types";

interface ParentContextType {
  userId: string;
  familyId: string;
  name: string;
  email: string;
  family: Family | null;
  isLoadingFamily: boolean;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ParentProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const familyId = user?.familyId;

  const { data: family, isLoading } = useSWR<Family>(
    familyId ? `/api/family/${familyId}` : null,
    fetcher
  );

  const value: ParentContextType = {
    userId: user?.id || "",
    familyId: familyId || "",
    name: user?.name || "",
    email: user?.email || "",
    family: family || null,
    isLoadingFamily: isLoading,
  };

  return (
    <ParentContext.Provider value={value}>
      {children}
    </ParentContext.Provider>
  );
}

export function useParent() {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error("useParent must be used within ParentProvider");
  }
  return context;
}