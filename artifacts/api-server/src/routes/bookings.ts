import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, destinationsTable } from "@workspace/db";
import {
  CreateBookingBody,
  GetBookingParams,
  ListBookingsResponse,
  GetBookingResponse,
} from "@workspace/api-zod";

function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "WL-";
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

function computeNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function getRoomMultiplier(roomType: string): number {
  switch (roomType) {
    case "Deluxe":
      return 1.4;
    case "Suite":
      return 2.0;
    case "Villa":
      return 3.2;
    case "Standard":
    default:
      return 1.0;
  }
}

const TAX_RATE = 0.12;

const router: IRouter = Router();

router.get("/bookings", async (_req, res): Promise<void> => {
  const bookings = await db
    .select()
    .from(bookingsTable)
    .orderBy(bookingsTable.createdAt);

  res.json(ListBookingsResponse.parse(bookings.map(b => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }))));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    destinationId,
    fullName,
    email,
    phone,
    adults,
    children = 0,
    checkIn,
    checkOut,
    roomType,
    specialRequests,
  } = parsed.data;
  const travelers = adults + children;

  const [destination] = await db
    .select()
    .from(destinationsTable)
    .where(eq(destinationsTable.id, destinationId));

  if (!destination) {
    res.status(400).json({ error: "Destination not found" });
    return;
  }

  const nights = computeNights(checkIn, checkOut);
  const roomMultiplier = getRoomMultiplier(roomType);
  const basePrice = destination.price * travelers * nights * roomMultiplier;
  const taxAmount = basePrice * TAX_RATE;
  const totalPrice = basePrice + taxAmount;
  const bookingRef = generateBookingRef();

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      bookingRef,
      destinationId,
      destinationName: destination.name,
      destinationImageUrl: destination.imageUrl,
      fullName,
      email,
      phone,
      adults,
      children,
      travelers,
      checkIn,
      checkOut,
      roomType,
      nights,
      specialRequests: specialRequests ?? null,
      status: "confirmed",
      basePrice,
      taxAmount,
      totalPrice,
    })
    .returning();

  res.status(201).json(GetBookingResponse.parse({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  }));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(GetBookingResponse.parse({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  }));
});

export default router;
