// app/actions/generate-description.ts
"use server"

import { moonshot } from "@/lib/moonshot"

export async function generateProjectDescription(
  projectName: string, 
  category: string, 
  gradeLevel: string
) {
  try {
    if (!projectName) return null;

    const completion = await moonshot.chat.completions.create({
      model: "moonshot-v1-8k", // or your preferred model
      messages: [
        {
          role: "system",
          content: "You are an enthusiastic teacher's assistant. Write a short, engaging (2-3 sentences) description for a student project. Keep the tone encouraging and age-appropriate."
        },
        {
          role: "user",
          content: `Create a description for a project named "${projectName}". 
          Category: ${category || "General"}. 
          Grade Level: ${gradeLevel || "General"}.`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Moonshot API Error:", error);
    throw new Error("Failed to generate description");
  }
}