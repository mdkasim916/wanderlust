import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingModal } from "@/components/booking-modal";
import { useListDestinations } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Check } from "lucide-react";

export default function Packages() {
  const { data: destinations, isLoading } = useListDestinations();
  const [bookingModal, setBookingModal] = useState<{ open: boolean; destId?: number; name?: string; price?: number }>({
    open: false,
  });

  const explorerPkgs = destinations?.filter(d => d.price <= 1800) || [];
  const signaturePkgs = destinations?.filter(d => d.price > 1800 && d.price <= 3000) || [];
  const elitePkgs = destinations?.filter(d => d.price > 3000) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary text-primary-foreground py-20 pt-32">
        <div className="container text-center">
          <p className="uppercase tracking-[0.2em] font-bold text-xs mb-4 text-primary-foreground/70">The Collections</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Curated Travel Packages</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            From wild frontiers to unparalleled luxury, find the journey that speaks to your soul across our three distinct tiers of travel.
          </p>
        </div>
      </div>

      <main className="flex-1 py-20 space-y-32">
        {/* Elite Tier */}
        <section className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Elite Collection</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Uncompromising luxury, exclusive access, and extraordinary experiences designed for the most discerning travelers.</p>
          </div>
          {isLoading ? (
             <div className="grid md:grid-cols-2 gap-8">{[1,2].map(i => <div key={i} className="h-[400px] bg-muted animate-pulse rounded-none" />)}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {elitePkgs.map(dest => (
                <Card key={dest.id} className="border-0 bg-secondary/10 rounded-none overflow-hidden group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={`/dest${(dest.id % 6) + 1}.png`} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">Elite • ${dest.price}</Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{dest.name}</h3>
                    <p className="text-sm font-medium text-primary flex items-center gap-1 mb-4"><MapPin className="h-4 w-4" /> {dest.country}</p>
                    <p className="text-muted-foreground mb-6 line-clamp-3">{dest.description}</p>
                    <ul className="space-y-2 mb-8">
                      {['Private transfers & concierge', '5-star luxury accommodations', 'Exclusive guided tours'].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary" /> {feature}</li>
                      ))}
                    </ul>
                    <Button onClick={() => setBookingModal({ open: true, destId: dest.id, name: dest.name, price: dest.price })} className="w-full rounded-none tracking-widest uppercase">
                      Reserve Journey <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Signature Tier */}
        <section className="bg-muted py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">Signature Collection</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">The perfect balance of cultural immersion, comfort, and authentic discovery.</p>
            </div>
            {isLoading ? (
               <div className="grid md:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-[400px] bg-background/50 animate-pulse rounded-none" />)}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {signaturePkgs.map(dest => (
                  <Card key={dest.id} className="border-0 rounded-none overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img src={`/dest${(dest.id % 6) + 1}.png`} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">Signature • ${dest.price}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2">{dest.name}</h3>
                      <p className="text-sm font-medium text-primary flex items-center gap-1 mb-4"><MapPin className="h-4 w-4" /> {dest.country}</p>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{dest.description}</p>
                      <Button variant="outline" onClick={() => setBookingModal({ open: true, destId: dest.id, name: dest.name, price: dest.price })} className="w-full rounded-none tracking-widest uppercase">
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Explorer Tier */}
        <section className="container pb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Explorer Collection</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Adventure-focused itineraries for the intrepid traveler seeking to connect with nature.</p>
          </div>
          {isLoading ? (
             <div className="grid md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-[350px] bg-muted animate-pulse rounded-none" />)}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {explorerPkgs.map(dest => (
                <Card key={dest.id} className="border border-border/50 shadow-sm rounded-none overflow-hidden group flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={`/dest${(dest.id % 6) + 1}.png`} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%]" />
                    <Badge className="absolute top-2 right-2 bg-background text-foreground text-xs shadow-sm">Explorer • ${dest.price}</Badge>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-serif font-bold text-foreground mb-1 line-clamp-1">{dest.name}</h3>
                    <p className="text-xs font-medium text-primary flex items-center gap-1 mb-3"><MapPin className="h-3 w-3" /> {dest.country}</p>
                    <p className="text-xs text-muted-foreground mb-6 line-clamp-2 flex-1">{dest.description}</p>
                    <Button variant="secondary" size="sm" onClick={() => setBookingModal({ open: true, destId: dest.id, name: dest.name, price: dest.price })} className="w-full rounded-none tracking-wider uppercase text-[10px]">
                      Secure Spot
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {bookingModal.destId && bookingModal.name && bookingModal.price && (
        <BookingModal 
          open={bookingModal.open} 
          onOpenChange={(open) => setBookingModal(prev => ({ ...prev, open }))}
          destinationId={bookingModal.destId}
          destinationName={bookingModal.name}
          price={bookingModal.price}
        />
      )}
    </div>
  );
}