import { useState } from "react"

export default function useGenerateDescription() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = async (projectName: string, category: string, gradeLevel: string) => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/generate/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, category, gradeLevel }),
      })

      if (!res.ok) throw new Error("Request failed")
      
      const data = await res.json()
      return data.description

    } catch (error) {
      console.error(error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { generate, isGenerating }
}