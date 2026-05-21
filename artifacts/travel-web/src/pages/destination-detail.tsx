import { useState } from "react";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingModal } from "@/components/booking-modal";
import { useGetDestination } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Share2,
  Heart,
  Loader2,
} from "lucide-react";
import { getDestinationContent } from "@/data/destination-content";

const CATEGORY_COLORS: Record<string, string> = {
  Luxury:    "bg-amber-100 text-amber-800",
  Adventure: "bg-emerald-100 text-emerald-800",
  Cultural:  "bg-purple-100 text-purple-800",
  Trekking:  "bg-orange-100 text-orange-800",
  Beach:     "bg-sky-100 text-sky-800",
};

export default function DestinationDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0");
  const { data: dest, isLoading, isError } = useGetDestination(id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !dest) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <MapPin className="h-16 w-16 text-muted-foreground/40 mb-6" />
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Destination Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-sm">
            This destination doesn't exist or may have been removed from our collection.
          </p>
          <Button asChild className="rounded-none px-8 py-5 uppercase tracking-widest font-bold">
            <Link href="/destinations">← Back to Destinations</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const content = getDestinationContent(dest.name);
  const gallery = content.gallery.length > 0 ? content.gallery : [dest.imageUrl];
  const activeImage = gallery[galleryIndex] ?? dest.imageUrl;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={activeImage}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Back */}
        <div className="absolute top-24 left-6 z-10">
          <Link
            href="/destinations"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold uppercase tracking-widest transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> All Destinations
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-24 right-6 z-10 flex gap-2">
          <button
            onClick={() => setLiked((l) => !l)}
            className={`h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors ${liked ? "bg-rose-500 border-rose-500 text-white" : "bg-white/20 border-white/30 text-white hover:bg-white/30"}`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </button>
          <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${CATEGORY_COLORS[dest.category] ?? "bg-muted text-muted-foreground"} border-0 text-xs font-bold uppercase tracking-widest px-3 py-1`}>
                {dest.category}
              </Badge>
              <span className="text-white/70 text-sm flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {dest.country}
              </span>
              <span className="text-white/70 text-sm flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {dest.rating} ({dest.reviewCount} reviews)
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight tracking-tight mb-4">
              {dest.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-mono">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {dest.duration} Days</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Max {dest.maxGroupSize} Guests</span>
              <span className="text-2xl font-serif font-bold text-white">${dest.price.toLocaleString()}<span className="text-base font-sans font-normal text-white/60 ml-1">/ person</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery thumbnails */}
      {gallery.length > 1 && (
        <div className="bg-foreground/95 px-6 py-3 flex gap-2 overflow-x-auto">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setGalleryIndex(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden border-2 transition-all ${i === galleryIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left — content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Overview */}
            <section>
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Overview</p>
              <h2 className="text-3xl font-serif font-bold mb-4">About This Experience</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{dest.description}</p>
              {dest.highlights && (
                <p className="text-muted-foreground leading-relaxed mt-4">{dest.highlights}</p>
              )}
            </section>

            {/* Highlights */}
            {content.highlights.length > 0 && (
              <section>
                <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Highlights</p>
                <h2 className="text-2xl font-serif font-bold mb-6">Trip Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {content.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-border/50 bg-muted/20">
                      <Star className="h-4 w-4 text-primary mt-0.5 shrink-0 fill-primary" />
                      <span className="text-sm font-medium leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            <section>
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Day by Day</p>
              <h2 className="text-2xl font-serif font-bold mb-6">Your Itinerary</h2>
              <div className="space-y-0">
                {content.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-4 group">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                        {day.day}
                      </div>
                      {i < content.itinerary.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border/60 my-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8 flex-1">
                      <h3 className="font-serif font-bold text-lg text-foreground mb-1.5 flex items-center gap-2">
                        {day.title}
                        <span className="text-xs text-muted-foreground font-sans font-normal uppercase tracking-wider">Day {day.day}</span>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Included / Excluded */}
            <section>
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Price Includes</p>
              <h2 className="text-2xl font-serif font-bold mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Included
                  </h3>
                  <ul className="space-y-2.5">
                    {content.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" /> Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {content.excluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Photo Gallery */}
            {gallery.length > 1 && (
              <section>
                <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-3">Gallery</p>
                <h2 className="text-2xl font-serif font-bold mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-2 gap-3">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className={`overflow-hidden cursor-pointer group ${i === 0 ? "col-span-2 h-72" : "h-48"}`}
                      onClick={() => setGalleryIndex(i)}
                    >
                      <img
                        src={img}
                        alt={`${dest.name} - photo ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right — sticky booking sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="border border-border/50 bg-card shadow-sm">
                <div className="bg-primary text-primary-foreground p-6">
                  <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-semibold mb-1">Starting from</p>
                  <p className="text-4xl font-serif font-bold">${dest.price.toLocaleString()}</p>
                  <p className="text-primary-foreground/70 text-sm">per person</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/40 p-3 text-center">
                      <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="font-bold">{dest.duration} Days</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="bg-muted/40 p-3 text-center">
                      <Users className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="font-bold">Max {dest.maxGroupSize}</p>
                      <p className="text-xs text-muted-foreground">Group Size</p>
                    </div>
                    <div className="bg-muted/40 p-3 text-center">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400 mx-auto mb-1" />
                      <p className="font-bold">{dest.rating}</p>
                      <p className="text-xs text-muted-foreground">{dest.reviewCount} Reviews</p>
                    </div>
                    <div className="bg-muted/40 p-3 text-center">
                      <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="font-bold">{dest.country}</p>
                      <p className="text-xs text-muted-foreground">Destination</p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-none py-6 uppercase tracking-widest font-bold text-sm"
                    onClick={() => setBookingOpen(true)}
                  >
                    Reserve Your Spot <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 48 hours before check-in
                  </p>
                </div>
              </div>

              {/* Need help */}
              <div className="border border-border/50 bg-muted/20 p-5 text-center">
                <p className="font-bold text-sm mb-1">Need personalised help?</p>
                <p className="text-xs text-muted-foreground mb-3">Our concierge team is available 7 days a week.</p>
                <Button asChild variant="outline" size="sm" className="rounded-none text-xs uppercase tracking-widest w-full">
                  <Link href="/contact">Contact Concierge</Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {["Best Price Guarantee", "ATOL Protected", "Expert Guides"].map((badge) => (
                  <div key={badge} className="border border-border/30 p-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-[10px] font-semibold text-muted-foreground leading-tight">{badge}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* CTA banner */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container px-6 text-center max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.2em] font-bold text-xs text-primary-foreground/70 mb-3">Don't Miss Out</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to experience {dest.name}?</h2>
          <p className="text-primary-foreground/80 mb-8">Join {(dest.reviewCount + 100).toLocaleString()} travellers who have explored this destination with WanderLux.</p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-none px-10 py-6 uppercase tracking-widest font-bold text-sm"
            onClick={() => setBookingOpen(true)}
          >
            Book Now — From ${dest.price.toLocaleString()} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        destinationId={dest.id}
        destinationName={dest.name}
        price={dest.price}
      />
    </div>
  );
}
