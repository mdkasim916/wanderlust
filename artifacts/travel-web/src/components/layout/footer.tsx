import { Compass, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary mt-auto">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
              <Compass className="h-6 w-6" />
              WanderLux
            </div>
            <p className="text-sm text-secondary-foreground/70">
              Curating unforgettable luxury travel experiences for the modern explorer.
            </p>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-primary">Explore</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tours</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Experiences</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Travel Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-primary">Company</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-primary">Contact</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> 123 Luxury Way, NY 10001</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@wanderlux.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-secondary-foreground/50">
          © {new Date().getFullYear()} WanderLux. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
