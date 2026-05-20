import { Compass, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto relative overflow-hidden pt-24 pb-12">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <Compass className="w-[800px] h-[800px] absolute -top-40 -right-40" />
      </div>
      <div className="container relative z-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6 lg:pr-8">
            <div className="flex items-center gap-2 font-serif text-3xl font-bold tracking-tight">
              <Compass className="h-8 w-8 text-primary" />
              <span>WanderLux</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Curating unforgettable luxury travel experiences for the modern explorer. Every destination is a new chapter in your story.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="h-10 w-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 text-primary">Discover</h3>
            <ul className="space-y-4 text-sm text-background/70">
              <li><a href="#" className="hover:text-white transition-colors">Curated Collections</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Featured Destinations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Editorial Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exclusive Offers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 text-primary">Company</h3>
            <ul className="space-y-4 text-sm text-background/70">
              <li><a href="#" className="hover:text-white transition-colors">The WanderLux Ethos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy & Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest mb-6 text-primary">Inquiries</h3>
            <ul className="space-y-4 text-sm text-background/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" /> 
                <span>123 Exploration Blvd<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" /> 
                <span>+1 (800) WANDER-LX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" /> 
                <span>concierge@wanderlux.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40 font-mono">
          <div>© {new Date().getFullYear()} WANDERLUX. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background/80 transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-background/80 transition-colors">TERMS</a>
            <a href="#" className="hover:text-background/80 transition-colors">SITEMAP</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
