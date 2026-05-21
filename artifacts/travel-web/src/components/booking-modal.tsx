import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Users,
  Calendar,
  BedDouble,
  User,
  Phone,
  Mail,
  FileText,
  Star,
} from "lucide-react";

const ROOM_TYPES = [
  { key: "Standard", label: "Standard", desc: "Cozy & comfortable", multiplier: 1.0, icon: "🛏️" },
  { key: "Deluxe", label: "Deluxe", desc: "Elevated experience", multiplier: 1.4, icon: "✨" },
  { key: "Suite", label: "Suite", desc: "Luxurious suite", multiplier: 2.0, icon: "🌟" },
  { key: "Villa", label: "Private Villa", desc: "Ultimate luxury", multiplier: 3.2, icon: "🏛️" },
];
const TAX_RATE = 0.12;

function computeNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}
function getTomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

const step1Schema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().int().min(1, "At least 1 adult required").max(12),
  children: z.coerce.number().int().min(0).max(8),
  roomType: z.string().min(1, "Select a room type"),
}).refine((d) => {
  if (!d.checkIn || !d.checkOut) return true;
  return computeNights(d.checkIn, d.checkOut) >= 1;
}, { message: "Check-out must be after check-in", path: ["checkOut"] });

const step2Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  specialRequests: z.string().optional(),
});

const fullSchema = step1Schema.and(step2Schema);
type BookingFormValues = z.infer<typeof fullSchema>;

interface BookingModalProps {
  destinationId: number;
  destinationName: string;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEP_LABELS = ["Trip Details", "Your Info", "Review & Confirm"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEP_LABELS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "bg-background border-primary text-primary"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${
                  active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-12 h-0.5 mb-4 mx-1 transition-all ${i < step ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CounterField({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center font-bold text-sm">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function BookingModal({
  destinationId,
  destinationName,
  price,
  open,
  onOpenChange,
}: BookingModalProps) {
  const queryClient = useQueryClient();
  const createBooking = useCreateBooking();
  const [step, setStep] = useState(0);
  const [successData, setSuccessData] = useState<{
    bookingRef: string;
    totalPrice: number;
    nights: number;
    roomType: string;
  } | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      checkIn: getTodayStr(),
      checkOut: getTomorrowStr(),
      adults: 2,
      children: 0,
      roomType: "Standard",
      fullName: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
    mode: "onChange",
  });

  const watchAll = form.watch();
  const nights = computeNights(watchAll.checkIn, watchAll.checkOut);
  const travelers = (watchAll.adults || 1) + (watchAll.children || 0);
  const selectedRoom = ROOM_TYPES.find((r) => r.key === watchAll.roomType) ?? ROOM_TYPES[0];
  const basePrice = price * travelers * Math.max(nights, 1) * selectedRoom.multiplier;
  const taxAmount = basePrice * TAX_RATE;
  const totalPrice = basePrice + taxAmount;

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setSuccessData(null);
        form.reset({
          checkIn: getTodayStr(),
          checkOut: getTomorrowStr(),
          adults: 2,
          children: 0,
          roomType: "Standard",
          fullName: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
      }, 350);
    }
  }, [open]);

  const goNext = async () => {
    const fieldsStep1: (keyof BookingFormValues)[] = ["checkIn", "checkOut", "adults", "children", "roomType"];
    const fieldsStep2: (keyof BookingFormValues)[] = ["fullName", "email", "phone"];
    const fields = step === 0 ? fieldsStep1 : fieldsStep2;
    const ok = await form.trigger(fields);
    if (ok) setStep((s) => s + 1);
  };

  const onSubmit = (data: BookingFormValues) => {
    createBooking.mutate(
      {
        data: {
          destinationId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          adults: data.adults,
          children: data.children,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          roomType: data.roomType,
          specialRequests: data.specialRequests || undefined,
        },
      },
      {
        onSuccess: (result) => {
          setSuccessData({
            bookingRef: result.bookingRef,
            totalPrice: result.totalPrice,
            nights: result.nights,
            roomType: result.roomType,
          });
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {successData ? (
          <div className="flex flex-col items-center justify-center p-10 space-y-5 text-center">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-serif font-bold mb-2">Booking Confirmed!</DialogTitle>
              <p className="text-muted-foreground">
                Your stay at <strong>{destinationName}</strong> is all set. A confirmation has been sent to your email.
              </p>
            </div>

            <div className="w-full bg-muted/60 border border-border rounded-lg p-5 space-y-3 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking Reference</span>
                <span className="font-mono font-bold tracking-widest text-primary">{successData.bookingRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">{destinationName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{successData.roomType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{successData.nights} {successData.nights === 1 ? "Night" : "Nights"}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                <span>Total Paid</span>
                <span className="text-primary">${successData.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-none">
                Close
              </Button>
              <Button asChild className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold">
                <a href="/dashboard">View My Bookings</a>
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Header */}
              <div className="bg-primary text-primary-foreground px-8 pt-8 pb-6">
                <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-semibold mb-1">Reserve Your Stay</p>
                <DialogTitle className="text-2xl font-serif font-bold text-primary-foreground">{destinationName}</DialogTitle>
                <p className="text-primary-foreground/80 text-sm mt-1">From <strong>${price.toLocaleString()}</strong> / person / night</p>
              </div>

              <div className="px-8 py-6">
                <StepIndicator step={step} />

                {/* Step 1: Trip Details */}
                {step === 0 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="checkIn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" /> Check-In
                            </FormLabel>
                            <FormControl>
                              <Input type="date" min={getTodayStr()} className="rounded-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="checkOut"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" /> Check-Out
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                min={watchAll.checkIn || getTomorrowStr()}
                                className="rounded-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border border-border/50 divide-y divide-border/50 rounded-none bg-muted/20">
                      <FormField
                        control={form.control}
                        name="adults"
                        render={({ field }) => (
                          <div className="px-4">
                            <CounterField
                              label="Adults"
                              sublabel="Age 18+"
                              value={field.value}
                              min={1}
                              max={12}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="children"
                        render={({ field }) => (
                          <div className="px-4">
                            <CounterField
                              label="Children"
                              sublabel="Ages 2–17"
                              value={field.value}
                              min={0}
                              max={8}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="roomType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 mb-3">
                              <BedDouble className="h-3.5 w-3.5" /> Room Type
                            </FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {ROOM_TYPES.map((room) => (
                                <button
                                  key={room.key}
                                  type="button"
                                  onClick={() => field.onChange(room.key)}
                                  className={`p-3 text-left border-2 transition-all rounded-none ${
                                    field.value === room.key
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/40 bg-background"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base">{room.icon}</span>
                                    <span className="font-bold text-sm">{room.label}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-1">{room.desc}</p>
                                  <p className="text-xs font-semibold text-primary">
                                    {room.multiplier === 1.0 ? "Base rate" : `×${room.multiplier} rate`}
                                  </p>
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {nights > 0 && (
                      <div className="bg-primary/5 border border-primary/20 p-4 text-sm">
                        <div className="flex justify-between text-muted-foreground mb-1">
                          <span>${price.toLocaleString()} × {travelers} guest{travelers !== 1 ? "s" : ""} × {nights} night{nights !== 1 ? "s" : ""} × {selectedRoom.multiplier}x</span>
                          <span>${basePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground mb-2">
                          <span>Taxes & fees (12%)</span>
                          <span>${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary border-t border-primary/20 pt-2">
                          <span>Estimated Total</span>
                          <span>${totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Guest Info */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" /> Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Smith" className="rounded-none" {...field} />
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
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" /> Email Address
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" className="rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 000-0000" className="rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialRequests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" /> Special Requests{" "}
                            <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Dietary needs, accessibility requirements, anniversary surprises..."
                              className="resize-none rounded-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                    <div className="border border-border/50 divide-y divide-border/50 text-sm">
                      <div className="px-4 py-3 bg-muted/30">
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Stay Details</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Destination</span>
                            <span className="font-medium">{destinationName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-In</span>
                            <span className="font-medium">{formatDate(watchAll.checkIn)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-Out</span>
                            <span className="font-medium">{formatDate(watchAll.checkOut)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{nights} Night{nights !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Room Type</span>
                            <span className="font-medium">{selectedRoom.icon} {selectedRoom.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Guests</span>
                            <span className="font-medium">
                              {watchAll.adults} Adult{watchAll.adults !== 1 ? "s" : ""}
                              {watchAll.children > 0 ? `, ${watchAll.children} Child${watchAll.children !== 1 ? "ren" : ""}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Guest Information</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name</span>
                            <span className="font-medium">{watchAll.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium truncate ml-4">{watchAll.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="font-medium">{watchAll.phone}</span>
                          </div>
                          {watchAll.specialRequests && (
                            <div>
                              <span className="text-muted-foreground block">Special Requests</span>
                              <span className="text-xs italic text-muted-foreground">{watchAll.specialRequests}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-primary/5">
                        <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Price Breakdown</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-muted-foreground">
                            <span>${price.toLocaleString()} × {travelers} guest{travelers !== 1 ? "s" : ""} × {nights} night{nights !== 1 ? "s" : ""}</span>
                            <span>${(price * travelers * nights).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>{selectedRoom.label} room upgrade (×{selectedRoom.multiplier})</span>
                            <span>${(basePrice - price * travelers * nights).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Taxes & fees (12%)</span>
                            <span>${taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary text-base pt-2 border-t border-primary/20">
                            <span>Total</span>
                            <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 p-3 border border-border/30">
                      <Star className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <p>
                        Free cancellation up to 48 hours before check-in. By confirming, you agree to our booking terms and cancellation policy.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-6 mt-2 border-t border-border/30">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep((s) => s - 1)}
                      className="rounded-none flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                  )}
                  {step < 2 && (
                    <Button
                      type="button"
                      onClick={goNext}
                      className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-1"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      type="submit"
                      className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                      ) : (
                        "Confirm & Book"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
