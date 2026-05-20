import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingRef: text("booking_ref").notNull().unique(),
  destinationId: integer("destination_id").notNull(),
  destinationName: text("destination_name").notNull(),
  destinationImageUrl: text("destination_image_url"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  travelers: integer("travelers").notNull().default(1),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("confirmed"),
  totalPrice: real("total_price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  bookingRef: true,
  createdAt: true,
});
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
