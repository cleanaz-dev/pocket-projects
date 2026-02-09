import { useState } from "react"

export default function useGenerateProjectImage() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Ensure all 3 arguments are passed and typed
  const generateImage = async (projectName: string, category: string, gradeLevel: string) => {
    setIsGeneratingImage(true)
    try {
      const response = await fetch("/api/generate/generate-project-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending all 3 variables required by your backend
        body: JSON.stringify({ projectName, category, gradeLevel }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()
      return data.imageUrl 
      
    } catch (error) {
      console.error("Error generating image:", error)
      return null
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return { generateImage, isGeneratingImage }
}