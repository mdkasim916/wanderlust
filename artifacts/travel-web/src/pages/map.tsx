import { useState, useEffect } from "react";
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
import { Star, MapPin, Clock, DollarSign } from "lucide-react";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DESTINATION_COORDS: Record<string, [number, number]> = {
  "Santorini Sunset Escape":    [36.3932,  25.4615],
  "Machu Picchu Trek":          [-13.1631, -72.5450],
  "Kyoto Cultural Immersion":   [35.0116,  135.7681],
  "Everest Base Camp Trek":     [27.9881,  86.9250],
  "Maldives Overwater Paradise":[4.1755,   73.5093],
  "Safari in the Serengeti":    [-2.3333,  34.8333],
  "Patagonia Wilderness Trek":  [-50.9423, -73.4068],
  "Amalfi Coast Road Trip":     [40.6340,  14.6027],
  "Bali Spiritual Journey":     [-8.4095,  115.1889],
  "Iceland Northern Lights":    [64.9631,  -19.0208],
  "Rajasthan Royal Experience": [27.0238,  74.2179],
  "Matterhorn Alpine Adventure":[45.9763,  7.6586],
};

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.4 });
  }, [center, zoom, map]);
  return null;
}

const CATEGORY_COLORS: Record<string, string> = {
  Luxury:    "#e07b5a",
  Adventure: "#2d8a6e",
  Cultural:  "#6b5ea8",
  Trekking:  "#b07a2a",
  Beach:     "#2a7db0",
};

export default function MapPage() {
  const { data: destinations, isLoading } = useListDestinations();
  const { data: stats } = useGetSiteStats();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 10]);
  const [mapZoom, setMapZoom] = useState(2);
  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);

  const handleSelect = (dest: { id: number; name: string }) => {
    const coords = DESTINATION_COORDS[dest.name];
    if (!coords) return;
    setSelectedId(dest.id);
    setFlyTarget({ center: coords, zoom: 6 });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      {/* Page header */}
      <div className="pt-24 pb-6 container px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-2">Global Reach</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Interactive Map</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Click any destination in the list to fly to its location on the map.
            </p>
          </div>
          <div className="flex gap-8 text-sm font-mono text-muted-foreground bg-muted px-6 py-4 shrink-0">
            <div>
              <span className="text-primary font-bold text-2xl block">{stats?.totalDestinations ?? 12}</span>
              Destinations
            </div>
            <div>
              <span className="text-primary font-bold text-2xl block">{stats?.totalCountries ?? 42}</span>
              Countries
            </div>
          </div>
        </div>
      </div>

      {/* Map + Sidebar layout — explicit heights so Leaflet renders */}
      <div className="flex-1 flex flex-col lg:flex-row border-t border-border/30" style={{ minHeight: 0 }}>

        {/* Destination sidebar */}
        <div className="w-full lg:w-96 shrink-0 border-r border-border/30 overflow-y-auto order-2 lg:order-1" style={{ maxHeight: '70vh', minHeight: '200px' }}>
          <div className="sticky top-0 bg-card/95 backdrop-blur px-4 py-3 border-b border-border/30 z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {destinations?.length ?? 0} Destinations
            </h3>
          </div>

          <div className="divide-y divide-border/30">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 animate-pulse">
                    <div className="w-20 h-16 bg-muted rounded shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))
              : destinations?.map((dest) => {
                  const hasCoords = !!DESTINATION_COORDS[dest.name];
                  const isSelected = selectedId === dest.id;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => hasCoords && handleSelect(dest)}
                      className={`w-full text-left flex gap-3 p-3 transition-colors ${
                        isSelected
                          ? "bg-primary/8 border-l-4 border-l-primary"
                          : "hover:bg-muted border-l-4 border-l-transparent"
                      } ${!hasCoords ? "opacity-50 cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="w-20 h-16 shrink-0 overflow-hidden rounded bg-muted">
                        {dest.imageUrl ? (
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">🗺️</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mb-1 self-start"
                          style={{
                            background: (CATEGORY_COLORS[dest.category] ?? "#888") + "22",
                            color: CATEGORY_COLORS[dest.category] ?? "#888",
                          }}
                        >
                          {dest.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm line-clamp-1 text-foreground">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-primary font-medium flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" /> {dest.country}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />{dest.price.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{dest.rating}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />{dest.duration}d
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Map — explicit pixel height so Leaflet tiles always load */}
        <div className="flex-1 order-1 lg:order-2 relative" style={{ height: '70vh', minHeight: '400px', isolation: 'isolate', zIndex: 0 }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {flyTarget && (
              <FlyTo center={flyTarget.center} zoom={flyTarget.zoom} />
            )}

            {destinations?.map((dest) => {
              const coords = DESTINATION_COORDS[dest.name];
              if (!coords) return null;
              const color = CATEGORY_COLORS[dest.category] ?? "#e07b5a";
              const customIcon = L.divIcon({
                className: "",
                html: `<div style="
                  background:${color};
                  color:#fff;
                  border:2px solid #fff;
                  border-radius:50%;
                  width:28px;height:28px;
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;font-weight:700;
                  box-shadow:0 2px 6px rgba(0,0,0,0.35);
                  cursor:pointer;
                ">${dest.id}</div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              });
              return (
                <Marker
                  key={dest.id}
                  position={coords}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedId(dest.id),
                  }}
                >
                  <Popup
                    maxWidth={260}
                    className="font-sans"
                  >
                    <div className="overflow-hidden -mx-3 -my-3" style={{ width: 240 }}>
                      <div className="relative h-32 overflow-hidden">
                        {dest.imageUrl ? (
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        ) : (
                          <div style={{ height: "100%", background: "#f0ebe5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🗺️</div>
                        )}
                        <span
                          style={{
                            position: "absolute", top: 8, left: 8,
                            background: color, color: "#fff",
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 2,
                          }}
                        >
                          {dest.category}
                        </span>
                      </div>
                      <div style={{ padding: "12px 12px 8px" }}>
                        <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: 15, margin: "0 0 2px", lineHeight: 1.3 }}>{dest.name}</p>
                        <p style={{ color: color, fontSize: 11, fontWeight: 600, margin: "0 0 8px" }}>{dest.country}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 10, padding: "6px 8px", background: "#f5f0eb", borderRadius: 4 }}>
                          <span>💵 ${dest.price.toLocaleString()}</span>
                          <span>⭐ {dest.rating}</span>
                          <span>📅 {dest.duration}d</span>
                        </div>
                        <a
                          href="/destinations"
                          style={{
                            display: "block", textAlign: "center",
                            background: "#c0614a", color: "#fff",
                            padding: "7px", fontSize: 11,
                            fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.1em", textDecoration: "none",
                            borderRadius: 2,
                          }}
                        >
                          View & Book
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <Footer />
    </div>
  );
}
