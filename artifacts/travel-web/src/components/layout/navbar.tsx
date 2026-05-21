import { Link, useLocation } from "wouter";
import { Compass, Menu, X, Map as MapIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const PRIMARY_LINKS = [
  { name: "Home", path: "/" },
  { name: "Destinations", path: "/destinations" },
  { name: "Packages", path: "/packages" },
  { name: "Gallery", path: "/gallery" },
];

const MORE_LINKS = [
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Reviews", path: "/reviews" },
  { name: "Map", path: "/map", icon: true },
];

const ALL_LINKS = [...PRIMARY_LINKS, ...MORE_LINKS];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = location === "/";
  const textBase = !scrolled && isHome ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground";
  const textActive = "text-primary";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50 py-3"
          : isHome
          ? "bg-transparent py-5"
          : "bg-background/90 backdrop-blur-md border-b border-border/20 py-3"
      }`}
    >
      <div className="container px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2 font-serif text-xl font-bold tracking-tight shrink-0 transition-colors ${
            !scrolled && isHome ? "text-white" : "text-foreground"
          }`}
        >
          <Compass
            className={`h-7 w-7 transition-transform duration-700 hover:rotate-180 ${
              !scrolled && isHome ? "text-white" : "text-primary"
            }`}
          />
          <span>WanderLux</span>
        </Link>

        {/* Desktop nav — visible at xl+ */}
        <nav className="hidden xl:flex items-center gap-5 flex-1 justify-center">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-xs tracking-widest uppercase font-semibold transition-colors ${
                location === link.path ? textActive : textBase
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* "More" dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={`flex items-center gap-1 text-xs tracking-widest uppercase font-semibold transition-colors ${
                MORE_LINKS.some((l) => l.path === location) ? textActive : textBase
              }`}
            >
              More <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-background border border-border shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase font-semibold transition-colors hover:bg-muted ${
                      location === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.name} {link.icon && <MapIcon className="h-3.5 w-3.5" />}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/dashboard"
            className={`text-xs tracking-widest uppercase font-semibold transition-colors ${
              location === "/dashboard" ? textActive : textBase
            }`}
          >
            My Bookings
          </Link>
        </nav>

        {/* Desktop CTA */}
        <Button
          asChild
          variant={!scrolled && isHome ? "secondary" : "default"}
          className="hidden xl:flex rounded-none px-6 py-4 uppercase tracking-widest text-xs font-bold shrink-0"
        >
          <Link href="/destinations">Book Now</Link>
        </Button>

        {/* Tablet / Mobile hamburger — visible below xl */}
        <Button
          variant="ghost"
          size="icon"
          className={`xl:hidden ${
            !scrolled && isHome ? "text-white hover:bg-white/20" : "text-foreground hover:bg-muted"
          }`}
          onClick={() => setMobileMenuOpen((o) => !o)}
          data-testid="button-menu-toggle"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile / Tablet slide-down menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b shadow-xl xl:hidden animate-in slide-in-from-top-4 z-50">
          <div className="container px-4 py-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            {ALL_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-1.5 text-sm tracking-widest uppercase font-semibold py-2 border-b border-border/30 transition-colors ${
                  location === link.path ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                data-testid={`link-nav-${link.name.toLowerCase()}`}
              >
                {link.name} {"icon" in link && link.icon && <MapIcon className="h-3.5 w-3.5" />}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-1.5 text-sm tracking-widest uppercase font-semibold py-2 border-b border-border/30 transition-colors ${
                location === "/dashboard" ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              My Bookings
            </Link>
          </div>
          <div className="container px-4 pb-6">
            <Button
              asChild
              className="w-full rounded-none py-5 uppercase tracking-widest font-bold"
            >
              <Link href="/destinations" onClick={() => setMobileMenuOpen(false)}>
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
