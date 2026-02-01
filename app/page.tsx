import { Header } from "@/components/ui/landing-page/header"
import { Hero } from "@/components/ui/landing-page/hero"

export default function LandingPage() {
  return (
    <main className="h-screen overflow-hidden flex flex-col bg-background container mx-auto max-w-7xl">
      <Header />
      <Hero />
    </main>
  )
}
