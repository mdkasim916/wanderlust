import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListBookings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Ticket,
  Plane,
  BedDouble,
  Phone,
  Mail,
  Moon,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr + "T00:00:00"), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
    case "cancelled":
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

const ROOM_ICONS: Record<string, string> = {
  Standard: "🛏️",
  Deluxe: "✨",
  Suite: "🌟",
  Villa: "🏛️",
};

export default function Dashboard() {
  const { data: bookings, isLoading } = useListBookings();
  const bookingList = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/30">
      <Navbar />

      <div className="bg-primary text-primary-foreground pt-28 pb-12">
        <div className="container px-6">
          <div className="flex items-center gap-3 mb-2">
            <Ticket className="h-7 w-7 text-primary-foreground/80" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold">My Bookings</h1>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            {bookingList.length
              ? `You have ${bookingList.length} booking${bookingList.length !== 1 ? "s" : ""}.`
              : "Manage your upcoming adventures from one place."}
          </p>
        </div>
      </div>

      <main className="container px-6 py-12 flex-1 max-w-5xl">
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <div className="h-52 bg-muted" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-6 w-64 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookingList.length === 0 ? (
          <Card className="border-dashed bg-background shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Plane className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold font-serif text-primary mb-2">No bookings yet</h3>
              <p className="text-muted-foreground max-w-sm mb-8">
                Explore our curated destinations and book your next unforgettable adventure.
              </p>
              <Button asChild className="rounded-none px-8 py-5 uppercase tracking-widest font-bold">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookingList.map((booking) => {
              const roomIcon = ROOM_ICONS[booking.roomType] ?? "🛏️";
              return (
                <Card key={booking.id} className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  {/* Header bar */}
                  <div className="bg-muted/40 border-b border-border/30 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-muted-foreground bg-background border border-border px-2 py-1 rounded tracking-widest">
                        {booking.bookingRef}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Booked {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`uppercase tracking-wider text-xs font-bold px-3 py-1 ${getStatusStyle(booking.status)}`}
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-56 shrink-0 relative">
                      <div className="h-44 md:h-full min-h-[11rem] bg-muted overflow-hidden">
                        {booking.destinationImageUrl ? (
                          <img
                            src={booking.destinationImageUrl}
                            alt={booking.destinationName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {roomIcon}
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="flex-1 p-6">
                      {/* Title + Price */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-primary mb-1">
                            {booking.destinationName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BedDouble className="h-3.5 w-3.5" />
                            <span>{roomIcon} {booking.roomType} Room</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-2xl font-bold text-primary block">
                            ${booking.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Price</span>
                        </div>
                      </div>

                      {/* Dates + duration */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 pb-5 border-b border-border/30">
                        <div>
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Check-In</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Check-Out</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Duration</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
                            {booking.nights} Night{booking.nights !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Guests</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {booking.adults}A{booking.children > 0 ? ` + ${booking.children}C` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Guest info + price breakdown */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-sm">
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">Guest Details</p>
                          <p className="flex items-center gap-2 text-foreground">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {booking.fullName}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {booking.email}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {booking.phone || "—"}
                          </p>
                        </div>

                        <div className="bg-muted/30 border border-border/30 p-3 text-sm space-y-1">
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" /> Price Breakdown
                          </p>
                          <div className="flex justify-between text-muted-foreground text-xs">
                            <span>Base price</span>
                            <span>${(booking.basePrice ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground text-xs">
                            <span>Taxes & fees</span>
                            <span>${(booking.taxAmount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary text-sm pt-1 border-t border-border/50">
                            <span>Total</span>
                            <span>${booking.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-4 bg-muted/30 border border-border/30 p-3 rounded text-sm">
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Special Requests
                          </p>
                          <p className="text-muted-foreground italic">{booking.specialRequests}</p>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
