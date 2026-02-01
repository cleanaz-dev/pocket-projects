import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Lightbulb className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">
          Pocket Projects
        </span>
      </div>
      <nav className="flex items-center gap-3">
        <Button variant="ghost" className="text-foreground hover:bg-primary/20">
          Sign In
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Sign Up
        </Button>
      </nav>
    </header>
  )
}
