// types/family-types.ts

export interface FamilyUser {
  id: string;
  name: string;
  email: string | null;
  type: "PARENT" | "CHILD";
  createdAt: string;
}

export interface ProjectOwner {
  id: string;
  name: string;
  type: "PARENT" | "CHILD";
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
}

export interface Family {
  id: string;
  name: string;
  users: FamilyUser[];
  projects: Project[];
  createdAt: string;
}