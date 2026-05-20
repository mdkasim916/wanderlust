import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking, getListBookingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  travelers: z.coerce.number().min(1, "Must have at least 1 traveler"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  destinationId: number;
  destinationName: string;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ destinationId, destinationName, price, open, onOpenChange }: BookingModalProps) {
  const queryClient = useQueryClient();
  const createBooking = useCreateBooking();
  const [successData, setSuccessData] = useState<{ bookingRef: string } | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      travelers: 1,
      specialRequests: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    createBooking.mutate({
      data: {
        destinationId,
        ...data,
      }
    }, {
      onSuccess: (result) => {
        setSuccessData({ bookingRef: result.bookingRef });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
        form.reset();
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(() => setSuccessData(null), 300);
    }
    onOpenChange(newOpen);
  };

  const travelers = form.watch("travelers") || 1;
  const total = price * travelers;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {successData ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in" />
            </div>
            <DialogTitle className="text-2xl font-serif text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Your trip to {destinationName} has been booked successfully.
            </DialogDescription>
            <div className="bg-secondary/50 p-4 rounded-lg w-full text-center mt-4 border border-secondary-border">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="font-mono font-bold text-lg tracking-wider">{successData.bookingRef}</p>
            </div>
            <Button onClick={() => handleOpenChange(false)} className="w-full mt-4">
              View Dashboard
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Book {destinationName}</DialogTitle>
              <DialogDescription>
                Complete your booking details below.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="travelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Travelers</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
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
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Dietary requirements, accessibility needs..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex items-center justify-between border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-xl font-bold text-primary">${total.toLocaleString()}</p>
                  </div>
                  <Button type="submit" size="lg" disabled={createBooking.isPending}>
                    {createBooking.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
