import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useGetSiteStats } from "@workspace/api-client-react";
import { Compass, Globe, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  const { data: stats } = useGetSiteStats();

  const team = [
    { name: "Eleanor Vance", role: "Founder & Chief Explorer", img: "https://ui-avatars.com/api/?name=Eleanor+Vance&background=1a3b2b&color=fff&size=200" },
    { name: "Julian Thorne", role: "Head of Curation", img: "https://ui-avatars.com/api/?name=Julian+Thorne&background=d85d3f&color=fff&size=200" },
    { name: "Aria Sterling", role: "Luxury Concierge", img: "https://ui-avatars.com/api/?name=Aria+Sterling&background=c9c2b4&color=1a3b2b&size=200" },
    { name: "Marcus Reed", role: "Expedition Leader", img: "https://ui-avatars.com/api/?name=Marcus+Reed&background=2d4239&color=fff&size=200" }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Story Section */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-secondary/20">
          <div className="container px-6 max-w-5xl mx-auto text-center">
            <Compass className="h-12 w-12 text-primary mx-auto mb-8" />
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8">Crafting Extraordinary Journeys Since 2009.</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-12">
              We believe travel is more than merely visiting a place—it is about profound connection, discovery, and transformation. WanderLux was born from a desire to elevate the art of travel, curating experiences that linger in the soul long after the return home.
            </p>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-foreground text-background py-16">
          <div className="container px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats?.totalDestinations || '100'}+</p>
                <p className="text-xs uppercase tracking-widest text-background/60">Destinations</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats?.totalCountries || '45'}</p>
                <p className="text-xs uppercase tracking-widest text-background/60">Countries</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif text-primary mb-2">15</p>
                <p className="text-xs uppercase tracking-widest text-background/60">Years Expertise</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif text-primary mb-2">{stats?.happyTravelers ? (stats.happyTravelers / 1000).toFixed(1) + 'k' : '10k'}</p>
                <p className="text-xs uppercase tracking-widest text-background/60">Happy Travelers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-background">
          <div className="container px-6">
            <div className="text-center mb-16">
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">Our Ethos</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto bg-primary/10 flex items-center justify-center rounded-full mb-6">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">Authentic Connection</h3>
                <p className="text-muted-foreground leading-relaxed">We bypass the superficial to forge deep, meaningful relationships with the cultures and landscapes we visit.</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto bg-primary/10 flex items-center justify-center rounded-full mb-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">Uncompromising Quality</h3>
                <p className="text-muted-foreground leading-relaxed">From thread counts to trail guides, every detail is rigorously tested and impeccably executed.</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 mx-auto bg-primary/10 flex items-center justify-center rounded-full mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4">Sustainable Exploration</h3>
                <p className="text-muted-foreground leading-relaxed">We travel with respect, ensuring our footprints protect and uplift the communities we inhabit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-muted/30 border-t">
          <div className="container px-6">
            <div className="text-center mb-16">
              <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">The Curators</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Meet the Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground text-center">{member.name}</h3>
                  <p className="text-sm uppercase tracking-widest text-primary text-center mt-2">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}