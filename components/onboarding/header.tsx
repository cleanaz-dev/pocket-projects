import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 font-bold transition-colors hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="text-lg tracking-tight text-foreground">Pocket Projects</span>
        </Link>

        {/* Right Side Actions */}
        <nav className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Already have an account?
          </Link>
        </nav>
      </div>
    </header>
  );
}