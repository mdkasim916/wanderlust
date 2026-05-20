import { Link, useLocation } from "wouter";
import { Compass, Menu, X, Map as MapIcon } from "lucide-react";
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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Packages", path: "/packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Reviews", path: "/reviews" },
    { name: "Map", path: "/map", icon: <MapIcon className="h-4 w-4 ml-1" /> },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-4' : isHome ? 'bg-transparent py-6' : 'bg-background/90 backdrop-blur-md border-b border-border/20 py-4'}`}>
      <div className="container px-6 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 font-serif text-2xl font-bold tracking-tight transition-colors ${!scrolled && isHome ? 'text-primary-foreground' : 'text-foreground'}`}>
          <Compass className={`h-8 w-8 transition-transform duration-700 hover:rotate-180 ${!scrolled && isHome ? 'text-primary-foreground' : 'text-primary'}`} />
          <span>WanderLux</span>
        </Link>

        <nav className="hidden lg:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} className={`text-sm tracking-widest uppercase transition-colors font-medium hover:text-primary flex items-center ${location === link.path ? "text-primary" : !scrolled && isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
              {link.name} {link.icon && link.icon}
            </Link>
          ))}
          <Link href="/dashboard" className={`text-sm tracking-widest uppercase transition-colors font-medium hover:text-primary ${location === "/dashboard" ? "text-primary" : !scrolled && isHome ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground"}`}>
            My Bookings
          </Link>
          <Button asChild variant={!scrolled && isHome ? "secondary" : "default"} className="rounded-none px-6 py-5 uppercase tracking-widest text-xs font-bold transition-transform hover:scale-105 active:scale-95">
            <Link href="/destinations">Book Now</Link>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className={`lg:hidden ${!scrolled && isHome ? 'text-primary-foreground hover:bg-white/20' : 'text-foreground hover:bg-muted'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b shadow-lg p-6 flex flex-col gap-6 lg:hidden animate-in slide-in-from-top-4 h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} onClick={() => setMobileMenuOpen(false)} className={`text-lg tracking-widest uppercase font-medium flex items-center ${location === link.path ? "text-primary" : "text-foreground"}`}>
              {link.name} {link.icon && link.icon}
            </Link>
          ))}
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
