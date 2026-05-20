import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListBookings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Ticket, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: bookings, isLoading } = useListBookings();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Travel Dashboard</h1>
          <p className="text-primary-foreground/80">Manage your bookings and upcoming adventures.</p>
        </div>
      </div>

      <main className="container py-12 flex-1 max-w-5xl">
        <h2 className="text-2xl font-serif font-bold mb-6 text-primary flex items-center gap-2">
          <Ticket className="h-6 w-6" /> Your Bookings
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-32 bg-muted rounded-xl" />
              </Card>
            ))}
          </div>
        ) : bookings?.length === 0 ? (
          <Card className="border-dashed bg-background shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plane className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold font-serif text-primary mb-2">No bookings yet</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                You haven't booked any trips yet. Explore our destinations and start your next adventure.
              </p>
              <Button asChild>
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings?.map((booking) => (
              <Card key={booking.id} className="overflow-hidden border border-border/50 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative">
                    {/* Map destinationId to an image */}
                    <img 
                      src={`/dest${(booking.destinationId % 6) + 1}.png`} 
                      alt={booking.destinationName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className={`backdrop-blur-md px-3 py-1 font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-6 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                            REF: {booking.bookingRef}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Booked {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary mt-2">
                          {booking.destinationName}
                        </h3>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="text-2xl font-bold text-primary block">${booking.totalPrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Travelers</p>
                        <p className="font-medium flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.travelers} {booking.travelers === 1 ? 'Person' : 'People'}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Guest Name</p>
                        <p className="font-medium">{booking.fullName}</p>
                      </div>
                      {booking.specialRequests && (
                        <div className="col-span-2 md:col-span-3 mt-2 bg-muted/30 p-3 rounded-md text-sm">
                          <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Special Requests
                          </p>
                          <p className="text-muted-foreground">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Needed import for empty state
import { Link } from "wouter";
import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
