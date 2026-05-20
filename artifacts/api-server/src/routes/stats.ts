import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { db, destinationsTable, bookingsTable } from "@workspace/db";
import { GetSiteStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ value: totalDestinations }] = await db
    .select({ value: count() })
    .from(destinationsTable);

  const [{ value: totalBookings }] = await db
    .select({ value: count() })
    .from(bookingsTable);

  res.json(GetSiteStatsResponse.parse({
    totalDestinations,
    totalBookings,
    totalCountries: 42,
    happyTravelers: 15800 + totalBookings,
  }));
});

export default router;
