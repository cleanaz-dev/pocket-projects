// types/project-types.ts
import { 
  Project, 
  Research, 
  Note, 
  ChatSession,
  WebLink,
  YtLink,
  ImgLink,
  ChatMessage
} from "@/lib/generated/prisma/client";

// Extended Research with all links
export interface ResearchWithLinks extends Research {
  webLinks: WebLink[];
  ytLinks: YtLink[];
  imgLinks: ImgLink[];
}

// Extended ChatSession with messages
export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}

// Full Project with all relations
export interface ProjectWithRelations extends Project {
  researches: ResearchWithLinks[];
  notes: Note[];
  chats: ChatSessionWithMessages[];
}