import { generateProjectImagePrompt } from "@/lib/moonshot";
import { replicate, models } from "../config";


export async function generateProjectImage(
  projectName: string,
  category: string,
  gradeLevel: string
) {
  const prompt = await generateProjectImagePrompt(projectName, category, gradeLevel);
  
  try {
    const input = {
      prompt,
      aspectRatio: "4:3",
      prompt_upsampling: false,
    };
    const output = await replicate.run(models.prunaai, { input });

    const firstOutput = Array.isArray(output) ? output[0] : output;
    return firstOutput.url().href;
  } catch (error) {
    console.error("Error generating mockup:", error);
    throw error;
  }
}