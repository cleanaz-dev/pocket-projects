// types/family-types.ts

// 1. Helper type for the lightweight project data inside User
export interface UserProjectSummary {
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
}

export interface FamilyUser {
  id: string;
  name: string;
  email: string | null;
  type: "PARENT" | "CHILD";
  avatar: string | null;       // Added: for the emoji/image
  color: string | null;        // Added: for the gradient
  projects: UserProjectSummary[]; // Added: to calculate active/completed stats
  createdAt: string;
}

export interface ProjectOwner {
  id: string;
  name: string;
  type: "PARENT" | "CHILD";
  avatar: string | null;       // Added: usually needed for project cards
  username: string | null;     // Added
}

export interface Research {
  id: string;
  title: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string | null;
  category: string | null;
  grade: string | null;
  ownerId: string;
  familyId: string;
  owner: ProjectOwner;
  researches: Research[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
  color: string | null;
}

export interface Family {
  id: string;
  name: string;
  users: FamilyUser[];
  projects: Project[];
  createdAt: string;
}