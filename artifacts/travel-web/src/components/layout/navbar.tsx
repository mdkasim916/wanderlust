import { Link, useLocation } from "wouter";
import { Compass, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
          <Compass className="h-6 w-6" />
          WanderLux
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/destinations" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/destinations" ? "text-primary" : "text-muted-foreground"}`}>
            Destinations
          </Link>
          <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
            Dashboard
          </Link>
          <Button asChild>
            <Link href="/destinations">Book Now</Link>
          </Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
