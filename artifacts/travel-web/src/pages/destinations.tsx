import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingModal } from "@/components/booking-modal";
import { useListDestinations } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, MapPin, Calendar, Users, Search, SlidersHorizontal, ArrowRight, Eye } from "lucide-react";

const CATEGORIES = ["Adventure", "Cultural", "Luxury", "Trekking", "Beach"];

export default function Destinations() {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [bookingModal, setBookingModal] = useState<{ open: boolean; destId?: number; name?: string; price?: number }>({
    open: false,
  });

  // Since the API expects a single category string, we'll just pass the first selected one
  // or undefined if none are selected
  const categoryParam = selectedCategories.length > 0 ? selectedCategories[0] : undefined;

  const { data: destinations, isLoading } = useListDestinations({
    search: search || undefined,
    category: categoryParam,
    maxPrice: priceRange[0],
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/30">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Explore Destinations</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Find your next unforgettable journey. From pristine beaches to mountain summits, 
            our curated experiences await.
          </p>
        </div>
      </div>

      <main className="container py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 bg-background rounded-xl p-6 shadow-sm border space-y-8">
              <div className="flex items-center gap-2 font-serif font-bold text-xl pb-4 border-b">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </div>

              {/* Search */}
              <div className="space-y-3">
                <Label className="font-semibold text-base">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search destinations..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <Label className="font-semibold text-base">Categories</Label>
                <div className="space-y-3">
                  {CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label 
                        htmlFor={`cat-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold text-base">Max Price</Label>
                  <span className="text-sm font-bold text-primary">${priceRange[0]}</span>
                </div>
                <Slider 
                  defaultValue={[5000]} 
                  max={10000} 
                  min={500} 
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setPriceRange([5000]);
                  setSelectedCategories([]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl h-[450px] bg-muted animate-pulse" />
                ))}
              </div>
            ) : destinations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-background rounded-xl border border-dashed">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">No destinations found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any destinations matching your current filters. Try adjusting your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6"
                  onClick={() => {
                    setSearch("");
                    setPriceRange([5000]);
                    setSelectedCategories([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {destinations?.map((dest) => (
                  <Card key={dest.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                    <Link href={`/destinations/${dest.id}`} className="relative h-56 overflow-hidden block">
                      <img 
                        src={dest.imageUrl} 
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80`; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90 font-semibold shadow-sm">
                          {dest.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span>{dest.rating} <span className="text-muted-foreground font-normal text-xs">({dest.reviewCount})</span></span>
                      </div>
                    </Link>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <Link href={`/destinations/${dest.id}`}>
                          <h3 className="font-serif text-2xl font-bold text-primary leading-tight hover:underline underline-offset-4 decoration-primary/40">
                            {dest.name}
                          </h3>
                        </Link>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-bold text-primary block">${dest.price.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Per Person</span>
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-accent flex items-center gap-1 mb-4">
                        <MapPin className="h-4 w-4" /> {dest.country}
                      </p>
                      
                      <p className="text-muted-foreground text-sm flex-1 mb-6 line-clamp-3">
                        {dest.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium text-muted-foreground bg-muted/50 p-3 rounded-lg mb-6">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {dest.duration} Days</span>
                        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Max {dest.maxGroupSize}</span>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 rounded-none text-xs uppercase tracking-widest font-bold"
                        >
                          <Link href={`/destinations/${dest.id}`}>
                            <Eye className="mr-1.5 h-3.5 w-3.5" /> View Details
                          </Link>
                        </Button>
                        <Button 
                          className="flex-1 rounded-none text-xs uppercase tracking-widest font-bold" 
                          onClick={() => setBookingModal({ open: true, destId: dest.id, name: dest.name, price: dest.price })}
                        >
                          Book Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
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
