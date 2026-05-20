import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListFeaturedDestinations, useListTestimonials, useGetSiteStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, DollarSign, Search, Users, Globe2, Plane } from "lucide-react";

export default function Home() {
  const { data: featuredDestinations, isLoading: loadingFeatured } = useListFeaturedDestinations();
  const { data: testimonials, isLoading: loadingTestimonials } = useListTestimonials();
  const { data: stats, isLoading: loadingStats } = useGetSiteStats();

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="/hero.png" 
            alt="Hero background" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="container relative z-20 text-center text-white space-y-6 max-w-4xl mx-auto px-4 mt-16">
            <Badge variant="outline" className="text-white border-white/30 backdrop-blur-sm bg-white/10 px-4 py-1.5 text-sm uppercase tracking-widest mb-4">
              Discover the Extraordinary
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Journey Beyond <br/> The Ordinary
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
              Curated luxury travel experiences for those who seek the exceptional. 
              Explore handpicked destinations crafted for the modern explorer.
            </p>
            
            {/* Search Bar */}
            <div className="mt-12 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl max-w-3xl mx-auto text-foreground">
              <div className="bg-white rounded-xl p-2 grid grid-cols-1 md:grid-cols-4 gap-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="flex items-center px-4 py-2">
                  <MapPin className="text-muted-foreground mr-3 h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Where</p>
                    <Input placeholder="Destination" className="border-0 p-0 h-auto focus-visible:ring-0 text-sm shadow-none" />
                  </div>
                </div>
                <div className="flex items-center px-4 py-2">
                  <Calendar className="text-muted-foreground mr-3 h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">When</p>
                    <Input placeholder="Dates" className="border-0 p-0 h-auto focus-visible:ring-0 text-sm shadow-none" />
                  </div>
                </div>
                <div className="flex items-center px-4 py-2">
                  <DollarSign className="text-muted-foreground mr-3 h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
                    <Input placeholder="Any" className="border-0 p-0 h-auto focus-visible:ring-0 text-sm shadow-none" />
                  </div>
                </div>
                <div className="p-2 flex items-center justify-center">
                  <Button asChild className="w-full h-12 rounded-lg text-base font-semibold shadow-lg hover-elevate">
                    <Link href="/destinations">
                      <Search className="mr-2 h-5 w-5" /> Search
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-24 bg-background">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-serif font-bold text-primary mb-4">Featured Collections</h2>
                <p className="text-muted-foreground text-lg">Hand-selected experiences ranging from serene beach retreats to thrilling mountain adventures.</p>
              </div>
              <Button asChild variant="outline" size="lg" className="shrink-0 group">
                <Link href="/destinations">
                  View All Destinations 
                  <Plane className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl h-[400px] bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredDestinations?.map((dest) => (
                  <Link key={dest.id} href={`/destinations`} className="group block h-full">
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={`/dest${(dest.id % 6) + 1}.png`} 
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
                            {dest.category}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 text-accent fill-accent" />
                          <span>{dest.rating}</span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-2xl font-bold text-primary group-hover:text-accent transition-colors">
                            {dest.name}
                          </h3>
                          <span className="text-xl font-bold text-primary shrink-0">${dest.price}</span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-4">
                          <MapPin className="h-4 w-4" /> {dest.country}
                        </p>
                        <p className="text-muted-foreground line-clamp-2 text-sm flex-1">
                          {dest.description}
                        </p>
                        <div className="mt-6 pt-4 border-t flex justify-between text-sm font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {dest.duration} Days</span>
                          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Max {dest.maxGroupSize}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-foreground/20">
              <div className="text-center px-4">
                <div className="flex justify-center mb-4"><Globe2 className="h-8 w-8 opacity-80" /></div>
                <h4 className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats?.totalCountries || '45'}+</h4>
                <p className="text-primary-foreground/70 uppercase tracking-widest text-sm font-semibold">Countries</p>
              </div>
              <div className="text-center px-4">
                <div className="flex justify-center mb-4"><MapPin className="h-8 w-8 opacity-80" /></div>
                <h4 className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats?.totalDestinations || '120'}+</h4>
                <p className="text-primary-foreground/70 uppercase tracking-widest text-sm font-semibold">Destinations</p>
              </div>
              <div className="text-center px-4">
                <div className="flex justify-center mb-4"><Users className="h-8 w-8 opacity-80" /></div>
                <h4 className="text-4xl md:text-5xl font-serif font-bold mb-2">{stats?.happyTravelers ? (stats.happyTravelers / 1000).toFixed(1) + 'k' : '10k+'}</h4>
                <p className="text-primary-foreground/70 uppercase tracking-widest text-sm font-semibold">Happy Travelers</p>
              </div>
              <div className="text-center px-4">
                <div className="flex justify-center mb-4"><Star className="h-8 w-8 opacity-80" /></div>
                <h4 className="text-4xl md:text-5xl font-serif font-bold mb-2">4.9</h4>
                <p className="text-primary-foreground/70 uppercase tracking-widest text-sm font-semibold">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-secondary">
          <div className="container max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">Traveler Stories</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Don't just take our word for it. Hear from those who have explored the world with WanderLux.</p>
            </div>

            {loadingTestimonials ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-background rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials?.slice(0, 3).map((testimonial) => (
                  <Card key={testimonial.id} className="bg-background border-none shadow-md">
                    <CardContent className="p-8">
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                        ))}
                      </div>
                      <p className="text-lg font-serif italic mb-8 relative">
                        <span className="text-4xl text-muted/50 absolute -top-4 -left-2 leading-none">"</span>
                        {testimonial.comment}
                        <span className="text-4xl text-muted/50 absolute -bottom-4 -right-2 leading-none">"</span>
                      </p>
                      <div className="flex items-center gap-4 pt-6 border-t">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {testimonial.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{testimonial.authorName}</p>
                          <p className="text-sm text-muted-foreground text-accent">{testimonial.destination}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
