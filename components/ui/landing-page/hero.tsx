import { Button } from "@/components/ui/button"
import { Sparkles, BookOpen, FlaskConical } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="flex-1 flex items-center px-6 md:px-12 lg:px-20">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-4 py-2 w-fit">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Learning made fun!
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Where Curiosity Meets{" "}
            <span className="text-primary">Discovery</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Pocket Projects helps kids explore amazing topics, build exciting research projects, 
            and share their discoveries with the world. Start your learning adventure today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-secondary text-secondary-foreground hover:bg-secondary/20 text-base px-8 py-6 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50">
                <BookOpen className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">100+ Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/50">
                <FlaskConical className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Fun Experiments</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md lg:max-w-lg">
            <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border-4 border-card shadow-2xl">
              <Image
                src="/hero-illustration.jpg"
                alt="Kids working together on research projects"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card px-4 py-3 shadow-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">10,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
