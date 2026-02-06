"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Paperclip, Loader2, Bot, X, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStudent } from "@/context/student-context";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
}

interface AiChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  persona: Persona;
  userId: string;
}

export function AiChatSheet({ open, onOpenChange, persona, userId }: AiChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const { studentId } = useStudent()

  // Reset messages when persona changes or chat opens
  useEffect(() => {
    if (open) {
      let welcomeText = "";

      switch (persona.id) {
        case "guru":
          welcomeText =
            "Greetings. I have analyzed your data. What complex problem shall we solve today?";
          break;
        case "friend":
          welcomeText =
            "Hey! What's up? I'm ready to help you crush this project. Let's go! 🚀";
          break;
        case "parent":
          welcomeText =
            "You're finally studying? About time. Don't waste my time, ask your question.";
          break;
        default:
          welcomeText = "How can I help you?";
      }

      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeText,
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, persona]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userContent = input;

    // Optimistic UI update
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent, // The new message text
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })), // History context
          persona: persona,
          userId: userId, // Replace with real auth user ID
          projectId: null, // Optional: Pass if inside a project page
          chatId: chatId, // Pass null if new, or ID if continuing
        }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();

      // Save the returned Chat ID so future messages go to the same DB session
      if (data.chatId) {
        setChatId(data.chatId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Use the icon passed from the persona
  const PersonaIcon = persona.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full bg-white/80 shadow-2xl backdrop-blur-xl sm:max-w-[480px] dark:bg-zinc-950/80 border-l border-white/20 dark:border-white/10"
          >
            <div className="flex h-full flex-col">
              {/* Dynamic Header */}
              <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${persona.bg} ${persona.color}`}
                  >
                    <PersonaIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {persona.name}
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                      </span>
                      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Online
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {message.role === "assistant" ? (
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border border-black/5 ${persona.bg}`}
                          >
                            <PersonaIcon
                              className={`h-4 w-4 ${persona.color}`}
                            />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                            <User className="h-4 w-4 text-white dark:text-black" />
                          </div>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm ${
                          message.role === "user"
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                            : "bg-white border border-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {/* REPLACE THE OLD <p> TAG WITH THIS: */}
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Style standard paragraphs
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0 leading-relaxed">
                                {children}
                              </p>
                            ),

                            // Style code blocks (inline and block)
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: any) => {
                              return inline ? (
                                // Inline Code (like `this`)
                                <code
                                  className="rounded bg-zinc-200/50 px-1 py-0.5 font-mono text-xs font-bold text-zinc-800 dark:bg-white/20 dark:text-zinc-200"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                // Block Code (multi-line)
                                <div className="my-3 overflow-hidden rounded-lg bg-zinc-950 dark:bg-zinc-950/50 border border-zinc-800/50">
                                  <div className="flex items-center justify-between bg-zinc-900 px-3 py-1.5 border-b border-zinc-800">
                                    <span className="text-[10px] text-zinc-400">
                                      Code
                                    </span>
                                  </div>
                                  <div className="p-3 overflow-x-auto">
                                    <code
                                      className="font-mono text-xs text-zinc-300 whitespace-pre-wrap"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  </div>
                                </div>
                              );
                            },

                            // Style Lists
                            ul: ({ children }) => (
                              <ul className="ml-4 list-disc space-y-1 mb-2">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="ml-4 list-decimal space-y-1 mb-2">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="pl-1">{children}</li>
                            ),

                            // Style Headers
                            h1: ({ children }) => (
                              <h1 className="mb-2 mt-4 text-lg font-bold">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="mb-2 mt-3 text-base font-bold">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1 mt-2 text-sm font-bold">
                                {children}
                              </h3>
                            ),

                            // Style Links
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-violet-600 hover:underline dark:text-violet-400 font-medium"
                              >
                                {children}
                              </a>
                            ),

                            // Style Blockquotes
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-zinc-300 pl-3 italic text-zinc-500 my-2 dark:border-zinc-700">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-black/5 ${persona.bg}`}
                      >
                        <PersonaIcon className={`h-4 w-4 ${persona.color}`} />
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        <span className="text-sm text-zinc-500">Typing...</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-6 pt-2">
                <div className="relative flex items-center overflow-hidden rounded-3xl bg-zinc-100 p-2 ring-1 ring-zinc-900/5 focus-within:ring-2 focus-within:ring-violet-500/20 dark:bg-zinc-900 dark:ring-white/10">
                  <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white hover:text-zinc-600 hover:shadow-sm dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-all">
                    <Paperclip className="h-4 w-4" />
                  </button>

                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder={`Message ${persona.name}...`}
                    className="flex-1 bg-transparent px-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100"
                  />

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                      input.trim() && !isLoading
                        ? "bg-zinc-900 text-white shadow-md hover:translate-x-0.5 hover:bg-zinc-800 dark:bg-white dark:text-black"
                        : "bg-transparent text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
