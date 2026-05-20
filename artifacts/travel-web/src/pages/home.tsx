import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListFeaturedDestinations, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Quote, ArrowRight, Plane, Globe, Camera } from "lucide-react";

export default function Home() {
  const { data: featuredDestinations, isLoading: loadingFeatured } = useListFeaturedDestinations();
  const { data: testimonials, isLoading: loadingTestimonials } = useListTestimonials();
  const { data: stats, isLoading: loadingStats } = useGetSiteStats();

  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-1">
        {/* Cinematic Hero */}
        <section className="relative h-[100dvh] min-h-[700px] flex items-end pb-24 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          
          <img 
            src="/hero.png" 
            alt="Majestic mountain landscape" 
            className="absolute inset-0 w-full h-full object-cover object-center animate-in fade-in duration-[2000ms] zoom-in-105"
          />
          
          <div className="container relative z-20 px-6 mx-auto animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-backwards">
            <div className="max-w-4xl">
              <p className="text-primary uppercase tracking-[0.3em] font-bold text-sm mb-6 flex items-center gap-4">
                <span className="h-[2px] w-12 bg-primary"></span>
                The Art of Travel
              </p>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.9] tracking-tighter text-primary-foreground mb-8">
                Untamed <br /> Elegance.
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl font-light mb-12 leading-relaxed">
                Curating transcendent journeys for those who seek the extraordinary. Let the world's most spectacular landscapes become the canvas for your next chapter.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild className="rounded-none px-10 py-7 text-sm tracking-widest uppercase font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:translate-y-[-2px]">
                  <Link href="/destinations">
                    Explore Collection <ArrowRight className="ml-3 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-foreground text-background py-16 border-b border-background/10">
          <div className="container px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="space-y-2">
                <p className="text-5xl font-serif text-primary">{stats?.totalDestinations || '100'}+</p>
                <p className="text-xs uppercase tracking-widest font-mono text-background/50">Curated Locales</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-serif text-primary">{stats?.totalCountries || '45'}</p>
                <p className="text-xs uppercase tracking-widest font-mono text-background/50">Countries</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-serif text-primary">4.9</p>
                <p className="text-xs uppercase tracking-widest font-mono text-background/50">Average Rating</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-serif text-primary">{stats?.happyTravelers ? (stats.happyTravelers / 1000).toFixed(1) + 'k' : '10k'}</p>
                <p className="text-xs uppercase tracking-widest font-mono text-background/50">Explorers</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Collection - Editorial Grid */}
        <section className="py-32 bg-background relative">
          <div className="container px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">Featured Selection</p>
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight tracking-tight">
                  Editor's Picks.
                </h2>
              </div>
              <Button asChild variant="ghost" className="shrink-0 uppercase tracking-widest text-xs font-bold hover:bg-transparent hover:text-primary">
                <Link href="/destinations">
                  View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {[1, 2, 3].map((i, idx) => (
                  <div key={i} className={`bg-muted animate-pulse ${idx === 0 ? 'md:col-span-8 h-[600px]' : idx === 1 ? 'md:col-span-4 h-[600px]' : 'md:col-span-12 h-[500px]'}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8">
                {featuredDestinations?.slice(0, 3).map((dest, idx) => {
                  const isLarge = idx === 0;
                  const isPortrait = idx === 1;
                  const isWide = idx === 2;
                  
                  return (
                    <Link key={dest.id} href={`/destinations`} className={`group block relative overflow-hidden ${isLarge ? 'md:col-span-8 h-[500px] md:h-[700px]' : isPortrait ? 'md:col-span-4 h-[500px] md:h-[700px]' : 'md:col-span-12 h-[500px]'}`}>
                      <img 
                        src={`/dest${(dest.id % 6) + 1}.png`} 
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      
                      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <p className="text-primary-foreground/70 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-2">
                          <MapPin className="h-3 w-3" /> {dest.country} • {dest.category}
                        </p>
                        <h3 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                          {dest.name}
                        </h3>
                        {isLarge && (
                          <p className="text-primary-foreground/80 max-w-xl line-clamp-2 text-lg font-light mb-6 hidden md:block">
                            {dest.description}
                          </p>
                        )}
                        <div className="flex items-center gap-6 text-sm font-mono tracking-wider text-primary-foreground">
                          <span>${dest.price.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {dest.rating}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Interstitial Quote */}
        <section className="py-32 bg-secondary/30 relative overflow-hidden">
          <div className="container px-6 relative z-10 text-center max-w-4xl mx-auto">
            <Quote className="h-16 w-16 text-primary/30 mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-serif font-light leading-snug text-foreground mb-8">
              "Travel is the only thing you buy that makes you richer. WanderLux curates the wealth of the world into experiences you will never forget."
            </h2>
            <p className="uppercase tracking-widest text-sm font-bold text-muted-foreground">— The Editorial Team</p>
          </div>
        </section>

        {/* Voices */}
        <section className="py-32 bg-foreground text-background">
          <div className="container px-6">
            <div className="text-center mb-24">
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">Chronicles</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-background mb-4">Traveler Stories.</h2>
            </div>

            {loadingTestimonials ? (
              <div className="grid md:grid-cols-3 gap-12">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-background/5 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                {testimonials?.slice(0, 3).map((testimonial, idx) => (
                  <div key={testimonial.id} className="relative">
                    <div className="text-primary text-6xl font-serif absolute -top-10 -left-6 opacity-20">{(idx + 1).toString().padStart(2, '0')}</div>
                    <div className="flex gap-1 mb-8">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <p className="text-lg font-light leading-relaxed mb-10 text-background/80 line-clamp-4">
                      "{testimonial.comment}"
                    </p>
                    <div className="border-t border-background/10 pt-6">
                      <p className="font-bold uppercase tracking-widest text-xs mb-1">{testimonial.authorName}</p>
                      <p className="text-sm font-serif italic text-background/50">Explored {testimonial.destination}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
