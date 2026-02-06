import { NextResponse } from "next/server"
import OpenAI from "openai"
import { prisma } from "@/lib/prisma" 

// Initialize OpenAI client pointing to Moonshot
const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: "https://api.moonshot.ai/v1",
})

// --- SYSTEM INSTRUCTIONS ---

// 1. Base rules to force Markdown formatting for better UI rendering
const BASE_INSTRUCTION = `
FORMATTING RULES:
- ALWAYS use Markdown.
- Use **bold** for key concepts.
- Use \`code blocks\` for any code, commands, or technical terms.
- Use lists (bullet points) for steps or options.
- Structure your response with clear headings if the answer is long.
`

// 2. Persona definitions combining personality + formatting rules
const PERSONA_PROMPTS: Record<string, string> = {
  guru: `
    You are a highly technical Tech Guru. 
    You provide precise, deep, and complex answers. 
    You value accuracy above all else.
    ${BASE_INSTRUCTION}
    SPECIFIC INSTRUCTIONS:
    - Use extensive code examples in standard code blocks.
    - Do NOT use emojis.
    - Speak professionally and academically.
    - If a solution is simple, explain why the complex way is better.
  `,
  
  friend: `
    You are a Funny Friend. 
    You are casual, supportive, and use slang (like 'lol', 'fr', 'bet').
    ${BASE_INSTRUCTION}
    SPECIFIC INSTRUCTIONS:
    - Use lots of emojis (🚀, 💻, ✨, 🔥) in every response.
    - Keep paragraphs short and punchy.
    - Treat the user like your best friend hanging out on Discord.
  `,
  
  parent: `
    You are an Angry Parent. 
    You are disappointed that the user doesn't know the answer already.
    You are strict, demanding, and scold the user slightly before giving the answer.
    ${BASE_INSTRUCTION}
    SPECIFIC INSTRUCTIONS:
    - Use CAPS LOCK for emphasis on your disappointment.
    - Use **bold** to shout specific words.
    - Only use angry emojis (😤, 😠, 🤦‍♂️) if necessary.
    - Lecture them about "back in my day" or "working hard".
  `,
}

export async function POST(req: Request) {
  try {
    const { message, messages, persona, userId, projectId, chatId } = await req.json()

    // --- 1. SESSION MANAGEMENT ---
    let currentChatId = chatId

    // If this is a new conversation and we have a user, create the session in DB
    if (!currentChatId && userId) {
      const newSession = await prisma.chatSession.create({
        data: {
          userId,
          projectId: projectId || null,
          persona: persona.id, // e.g., "guru"
          title: message.substring(0, 40) + "...", // Auto-title
        },
      })
      currentChatId = newSession.id
    }

    // --- 2. SAVE USER MESSAGE ---
    if (currentChatId) {
      await prisma.chatMessage.create({
        data: {
          chatId: currentChatId,
          role: "user",
          content: message,
        },
      })
    }

    // --- 3. PREPARE AI PROMPT ---
    const systemPrompt = PERSONA_PROMPTS[persona.id] || "You are a helpful assistant." + BASE_INSTRUCTION
    
    // Construct full history for the API
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages, // Previous context from frontend
    ]

    // --- 4. CALL MOONSHOT API ---
    const completion = await client.chat.completions.create({
      model: "moonshot-v1-8k",
      messages: apiMessages,
      temperature: 0.3, // 0.3 = focused/consistent, 0.7 = creative
    })

    const aiContent = completion.choices[0].message.content || ""

    // --- 5. SAVE AI RESPONSE ---
    if (currentChatId && aiContent) {
      await prisma.chatMessage.create({
        data: {
          chatId: currentChatId,
          role: "assistant",
          content: aiContent,
        },
      })
    }

    // --- 6. RETURN RESPONSE ---
    return NextResponse.json({ 
      content: aiContent, 
      chatId: currentChatId 
    })

  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    )
  }
}