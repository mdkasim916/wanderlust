import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useListTestimonials } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Quote, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Reviews() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const testimonialList = Array.isArray(testimonials) ? testimonials : [];

  const blogPosts = [
    {
      id: 1,
      title: "Chasing Sunsets in Santorini: A Photographer's Guide",
      excerpt: "The golden hour in Oia is legendary. Here is how to capture the perfect shot while avoiding the crowds and finding hidden vantage points along the caldera.",
      author: "Julian Thorne",
      date: "Oct 12, 2023",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"
    },
    {
      id: 2,
      title: "The Silent Majesty of Machu Picchu at Dawn",
      excerpt: "Arriving before the sun breaches the Andes reveals a different side of the Incan citadel. An account of the spiritual journey along the final steps of the Inca Trail.",
      author: "Eleanor Vance",
      date: "Sep 28, 2023",
      category: "Adventure",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80"
    },
    {
      id: 3,
      title: "Kyoto's Hidden Tea Houses",
      excerpt: "Beyond the famous bamboo groves lies a network of historic tea houses where the ancient rituals of matcha preparation are still meticulously observed.",
      author: "Aria Sterling",
      date: "Aug 15, 2023",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80"
    },
    {
      id: 4,
      title: "Dancing with the Aurora: Winter in Iceland",
      excerpt: "Standing beneath the swirling green lights of the aurora borealis changes you. A survival guide to winter expeditions in the land of fire and ice.",
      author: "Marcus Reed",
      date: "Jan 05, 2024",
      category: "Nature",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">The Chronicles</p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Stories & Reviews</h1>
            <p className="text-muted-foreground text-lg">
              Read firsthand accounts from our travelers and explore editorial pieces from our seasoned expedition team.
            </p>
          </div>

          <Tabs defaultValue="reviews" className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-muted p-1">
                <TabsTrigger value="reviews" className="px-8 py-3 text-sm tracking-widest uppercase data-[state=active]:bg-background data-[state=active]:text-primary">Guest Reviews</TabsTrigger>
                <TabsTrigger value="stories" className="px-8 py-3 text-sm tracking-widest uppercase data-[state=active]:bg-background data-[state=active]:text-primary">Travel Stories</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="reviews" className="animate-in fade-in duration-500">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {testimonialList.map((review) => (
                    <div key={review.id} className="bg-card border border-border/50 p-8 md:p-10 relative">
                      <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/10" />
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                        ))}
                      </div>
                      <p className="text-xl font-serif leading-relaxed mb-8 italic">"{review.comment}"</p>
                      <div className="flex items-center justify-between border-t border-border/50 pt-6">
                        <div>
                          <p className="font-bold text-sm uppercase tracking-widest">{review.authorName}</p>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{review.destination}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="stories" className="animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-10">
                {blogPosts.map((post) => (
                  <article key={post.id} className="group cursor-pointer">
                    <div className="overflow-hidden aspect-video mb-6 relative">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {post.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{post.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  </article>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}