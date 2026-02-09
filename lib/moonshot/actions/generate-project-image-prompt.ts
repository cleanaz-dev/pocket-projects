// app/actions/generate-project-image-prompt.ts
"use server"

import { moonshot } from "@/lib/moonshot"

export async function generateProjectImagePrompt(
  projectName: string, 
  category: string, 
  gradeLevel: string
) {
  try {
    if (!projectName) return null;

    const completion = await moonshot.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content: `You are an expert at creating PrunaAI/P-Image prompts following their official guidelines.

STRUCTURE (in this order):
1. Primary Subject - The main focus (be specific, not generic)
2. Subject Behavior - What the subject is doing
3. Visual Style - Artistic medium/aesthetic  
4. Environmental Context - Setting, lighting, mood

RULES:
- Use descriptive, direct language (NOT commands like "create" or "generate")
- Be specific: "oak tree against orange sky" NOT "nice scenery"
- Focus on positive descriptions, avoid negations
- Keep compatible styles together
- Include quality terms: "professional", "detailed", "high quality"
- Age-appropriate and educational for students
- 20-50 words optimal (medium length)
- ALWAYS use illustration styles (digital illustration, cartoon style, vector art, animated style, etc.)
- NEVER include real people, photographs, or photorealistic humans
- Use illustrated characters, icons, symbols, or abstract representations instead

RETURN ONLY THE PROMPT - no explanations, no preamble, no markdown.`
        },
        {
          role: "user",
          content: `Create a P-Image prompt for:
Project: "${projectName}"
Category: ${category || "General"}
Grade: ${gradeLevel || "General"}

The image should work as an engaging educational project cover/thumbnail for students.`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Moonshot API Error:", error);
    throw new Error("Failed to generate image prompt");
  }
}