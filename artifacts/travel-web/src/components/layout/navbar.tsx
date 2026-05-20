import { Link, useLocation } from "wouter";
import { Compass, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === '/';

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-4' : isHome ? 'bg-transparent py-6' : 'bg-background/90 backdrop-blur-md border-b border-border/20 py-4'}`}>
      <div className="container px-6 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 font-serif text-2xl font-bold tracking-tight transition-colors ${!scrolled && isHome ? 'text-primary-foreground' : 'text-foreground'}`}>
          <Compass className={`h-8 w-8 transition-transform duration-700 hover:rotate-180 ${!scrolled && isHome ? 'text-primary-foreground' : 'text-primary'}`} />
          <span>WanderLux</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/destinations" className={`text-sm tracking-widest uppercase transition-colors font-medium hover:text-primary ${location === "/destinations" ? "text-primary" : !scrolled && isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            Destinations
          </Link>
          <Link href="/dashboard" className={`text-sm tracking-widest uppercase transition-colors font-medium hover:text-primary ${location === "/dashboard" ? "text-primary" : !scrolled && isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            My Bookings
          </Link>
          <Button asChild variant={!scrolled && isHome ? "secondary" : "default"} className="rounded-none px-8 py-5 uppercase tracking-widest text-xs font-bold transition-transform hover:scale-105 active:scale-95">
            <Link href="/destinations">Book Now</Link>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className={`md:hidden ${!scrolled && isHome ? 'text-primary-foreground hover:bg-white/20' : 'text-foreground hover:bg-muted'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b shadow-lg p-6 flex flex-col gap-6 md:hidden animate-in slide-in-from-top-4">
          <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className={`text-lg tracking-widest uppercase font-medium ${location === "/destinations" ? "text-primary" : "text-foreground"}`}>
            Destinations
          </Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`text-lg tracking-widest uppercase font-medium ${location === "/dashboard" ? "text-primary" : "text-foreground"}`}>
            My Bookings
          </Link>
          <Button asChild className="rounded-none py-6 uppercase tracking-widest w-full">
            <Link href="/destinations" onClick={() => setMobileMenuOpen(false)}>Book Now</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
