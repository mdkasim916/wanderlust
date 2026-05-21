import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Fix Vite asset resolution for Leaflet default icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. Our concierge team will contact you shortly.",
        variant: "default",
      });
      form.reset();
    }, 500);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-primary uppercase tracking-[0.2em] font-bold text-xs mb-4">Get In Touch</p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Contact the Concierge</h1>
            <p className="text-muted-foreground text-lg">
              Whether you are ready to book your next journey or simply seeking inspiration, our dedicated team is here to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Form Side */}
            <div className="bg-card border border-border/50 p-8 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-t-0 border-x-0 border-b-2 bg-transparent px-0 focus:ring-0 focus:border-primary">
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="General Enquiry">General Enquiry</SelectItem>
                            <SelectItem value="Booking Help">Booking Help</SelectItem>
                            <SelectItem value="Custom Itinerary">Custom Itinerary</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you plan your perfect journey?" 
                            className="resize-none min-h-[150px] rounded-none border-2 bg-transparent focus-visible:ring-0 focus-visible:border-primary p-4"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full rounded-none tracking-widest uppercase font-bold py-6">
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>

            {/* Info Side */}
            <div className="flex flex-col gap-12">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-primary h-5 w-5" /> Headquarters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    123 Exploration Blvd<br />
                    Suite 450<br />
                    New York, NY 10001
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Phone className="text-primary h-5 w-5" /> Contact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    +1 (800) WANDER-LX<br />
                    +1 (212) 555-0199
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Mail className="text-primary h-5 w-5" /> Digital</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    concierge@wanderlux.com<br />
                    press@wanderlux.com
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-primary h-5 w-5" /> Hours</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mon - Fri: 9am - 7pm EST<br />
                    Sat - Sun: 10am - 4pm EST
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 min-h-[300px] border border-border/50 relative overflow-hidden bg-muted" style={{ isolation: "isolate", zIndex: 0 }}>
                <MapContainer 
                  center={[-8.4095, 115.1889]} 
                  zoom={10} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[-8.4095, 115.1889]}>
                    <Popup className="font-sans">
                      <div className="text-center font-bold">WanderLux Bali Retreat</div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}