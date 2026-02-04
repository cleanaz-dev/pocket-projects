import { z } from "zod";

export const parentSignUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const childSignUpSchema = z.object({
  firstName: z.string().min(1, "Child's name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ParentSignUpData = z.infer<typeof parentSignUpSchema>;
export type ChildSignUpData = z.infer<typeof childSignUpSchema>;