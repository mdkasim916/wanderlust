import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListDestinations, useGetSiteStats } from "@workspace/api-client-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";

// Fix Vite asset resolution for Leaflet default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DESTINATION_COORDS: Record<string, [number, number]> = {
  "Santorini Sunset Escape":   [36.3932,   25.4615],
  "Machu Picchu Trek":         [-13.1631,  -72.5450],
  "Kyoto Cultural Immersion":  [35.0116,   135.7681],
  "Everest Base Camp Trek":    [27.9881,   86.9250],
  "Maldives Overwater Paradise":[4.1755,   73.5093],
  "Safari in the Serengeti":   [-2.3333,   34.8333],
  "Patagonia Wilderness Trek":  [-50.9423, -73.4068],
  "Amalfi Coast Road Trip":    [40.6340,   14.6027],
  "Bali Spiritual Journey":    [-8.4095,   115.1889],
  "Iceland Northern Lights":   [64.9631,   -19.0208],
  "Rajasthan Royal Experience":[27.0238,   74.2179],
  "Matterhorn Alpine Adventure":[45.9763,  7.6586],
};

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const { data: destinations, isLoading } = useListDestinations();
  const { data: stats } = useGetSiteStats();

  const handleCardClick = (name: string) => {
    const coords = DESTINATION_COORDS[name];
    if (coords) {
      // Logic handled by wrapping MapUpdater, but we need state.
      // Alternatively, relying on Leaflet's internal popup opening is enough if we just pan.
      // We will dispatch a custom event or use state if we want to center the map.
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-0 flex flex-col h-[100dvh]">
        <div className="container px-6 mb-8 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-2">Global Reach</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Interactive Map</h1>
            </div>
            <div className="flex gap-8 text-sm font-mono text-muted-foreground bg-muted p-4 rounded-lg">
              <div><span className="text-primary font-bold text-xl block">{stats?.totalDestinations || 12}</span> Destinations</div>
              <div><span className="text-primary font-bold text-xl block">{stats?.totalCountries || 10}</span> Countries</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row relative z-0">
          {/* Sidebar */}
          <div className="w-full lg:w-96 bg-card border-r border-t lg:border-t-0 border-border/50 h-[40vh] lg:h-full overflow-y-auto order-2 lg:order-1">
            <div className="p-4 sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border/50">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">All Destinations</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-md" />)
              ) : (
                destinations?.map(dest => (
                  <div key={dest.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border/50">
                    <img src={`/dest${(dest.id % 6) + 1}.png`} alt={dest.name} className="w-20 h-20 object-cover rounded-md shrink-0" />
                    <div className="flex flex-col justify-center">
                      <h4 className="font-serif font-bold text-sm line-clamp-1">{dest.name}</h4>
                      <p className="text-xs text-primary font-medium mb-1"><MapPin className="h-3 w-3 inline" /> {dest.country}</p>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>${dest.price}</span>
                        <span className="flex items-center"><Star className="h-3 w-3 text-accent fill-accent" /> {dest.rating}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 h-[60vh] lg:h-full bg-muted order-1 lg:order-2">
            <MapContainer 
              center={[20, 10]} 
              zoom={2} 
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {destinations?.map(dest => {
                const coords = DESTINATION_COORDS[dest.name];
                if (!coords) return null;
                return (
                  <Marker key={dest.id} position={coords}>
                    <Popup className="font-sans min-w-[250px] !p-0 overflow-hidden rounded-lg">
                      <div className="flex flex-col">
                        <img src={`/dest${(dest.id % 6) + 1}.png`} alt={dest.name} className="w-full h-32 object-cover" />
                        <div className="p-4 pb-2 text-center">
                          <h4 className="font-serif font-bold text-lg mb-1 !m-0 leading-tight">{dest.name}</h4>
                          <p className="text-primary text-xs uppercase tracking-widest font-bold !m-0 !mb-3">{dest.country}</p>
                          <div className="flex justify-between items-center text-sm font-medium mb-4 bg-muted p-2 rounded">
                            <span>${dest.price}</span>
                            <span className="flex items-center"><Star className="h-3 w-3 text-accent fill-accent mr-1" /> {dest.rating}</span>
                            <span className="flex items-center"><Clock className="h-3 w-3 text-muted-foreground mr-1" /> {dest.duration}d</span>
                          </div>
                          <Button asChild className="w-full h-8 text-xs rounded-none">
                            <Link href="/destinations">View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}