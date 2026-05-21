import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListDestinations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import type { Destination } from "@workspace/api-client-react";

const CATEGORIES = ["All", "Adventure", "Cultural", "Luxury", "Trekking", "Beach"];

export default function Gallery() {
  const { data: destinations, isLoading } = useListDestinations();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<{ src: string; dest: Destination } | null>(null);
  const destinationList = Array.isArray(destinations) ? destinations : [];

  const filteredDestinations = destinationList.filter(
    (dest) => activeCategory === "All" || dest.category === activeCategory
  ) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 px-6 text-center max-w-3xl mx-auto">
          <Camera className="h-10 w-10 text-primary mx-auto mb-6" />
          <p className="uppercase tracking-[0.2em] font-bold text-xs mb-4 text-primary">Through The Lens</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Visual Journeys</h1>
          <p className="text-lg text-background/80 font-light leading-relaxed">
            A curated collection of moments captured across the globe. Let these images inspire your next great adventure.
          </p>
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="container px-6 mb-12">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-6 transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:border-primary hover:text-primary'}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Masonry Grid */}
          {isLoading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`bg-muted animate-pulse rounded-none break-inside-avoid ${i % 2 === 0 ? 'h-64' : 'h-96'}`} />
              ))}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredDestinations.map((dest) => {
                const src = `/dest${(dest.id % 6) + 1}.png`;
                // Determine a pseudo-random height class to create masonry feel
                const heightClass = dest.id % 3 === 0 ? "h-[30rem]" : dest.id % 2 === 0 ? "h-[24rem]" : "h-[20rem]";
                
                return (
                  <div 
                    key={dest.id} 
                    className={`relative overflow-hidden group cursor-pointer break-inside-avoid ${heightClass}`}
                    onClick={() => setSelectedImage({ src, dest })}
                  >
                    <img
                      src={src}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex flex-col justify-end p-8">
                      <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-primary font-bold tracking-widest uppercase text-xs mb-2">{dest.country}</p>
                        <h3 className="text-2xl font-serif text-white">{dest.name}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {!isLoading && filteredDestinations.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>No images found for this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-6 right-6 text-white hover:bg-white/20 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </Button>
          
          <div className="max-w-5xl w-full p-6 relative">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.dest.name} 
              className="w-full max-h-[80vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500" 
            />
            <div className="absolute bottom-12 left-12 right-12 text-center text-white mix-blend-difference drop-shadow-md">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">{selectedImage.dest.name}</h2>
              <p className="uppercase tracking-[0.3em] text-sm">{selectedImage.dest.country}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}