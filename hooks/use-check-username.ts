import { useState, useEffect } from "react"

interface UseCheckUsernameResult {
  isChecking: boolean
  isAvailable: boolean | null
  error: string | null
}

export function useCheckUsername(username: string, debounceMs: number = 500): UseCheckUsernameResult {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset state if username is empty or too short
    if (!username || username.length < 3) {
      setIsAvailable(null)
      setError(null)
      setIsChecking(false)
      return
    }

    // Debounce the username check
    const timeoutId = setTimeout(async () => {
      setIsChecking(true)
      setError(null)

      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
        
        if (!response.ok) {
          throw new Error("Failed to check username")
        }

        const data = await response.json()
        setIsAvailable(data.available)
      } catch (err) {
        console.error("Error checking username:", err)
        setError("Failed to check username availability")
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [username, debounceMs])

  return { isChecking, isAvailable, error }
}