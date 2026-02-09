import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const GRADIENT_MAP: Record<string, string> = {
  blue:   "from-blue-400 to-indigo-600",
  green:  "from-emerald-400 to-teal-600",
  purple: "from-violet-400 to-fuchsia-600",
  orange: "from-amber-400 to-orange-600",
  pink:   "from-pink-400 to-rose-600",
  red:    "from-red-400 to-red-600",
  teal:   "from-teal-400 to-cyan-600",
};
export function getColorGradient(color: string | null | undefined): string {
  // Handle null/undefined or capitalization (e.g., "BLUE" -> "blue")
  const normalizedColor = color?.toLowerCase() || "blue";

  // Return the mapped gradient or fallback to blue if the color isn't found
  return GRADIENT_MAP[normalizedColor] || GRADIENT_MAP["blue"];
}

// lib/utils/image-url.ts
export function getImageUrl(key: string | null | undefined): string {
  if (!key) return "/placeholder-project.jpg";
  
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }
  
  if (key.startsWith("/")) {
    return key;
  }
  
  // Extract familyId from the key (first segment)
  const parts = key.split('/');
  const familyId = parts[0];
  const remainingKey = parts.slice(1).join('/');
  
  return `/api/family/${familyId}/media/${remainingKey}`;
}