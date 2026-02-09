import OpenAI from "openai"
import 'dotenv/config';

// Initialize OpenAI client pointing to Moonshot
export const moonshot = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
})
