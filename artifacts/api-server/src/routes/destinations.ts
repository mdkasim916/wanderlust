import { Router, type IRouter } from "express";
import { ilike, and, gte, lte, eq } from "drizzle-orm";
import { db, destinationsTable } from "@workspace/db";
import {
  ListDestinationsQueryParams,
  GetDestinationParams,
  ListDestinationsResponse,
  ListFeaturedDestinationsResponse,
  GetDestinationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/destinations", async (req, res): Promise<void> => {
  const parsed = ListDestinationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, minPrice, maxPrice, search } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(destinationsTable.category, category));
  if (minPrice !== undefined) conditions.push(gte(destinationsTable.price, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(destinationsTable.price, maxPrice));
  if (search) conditions.push(ilike(destinationsTable.name, `%${search}%`));

  const destinations = await db
    .select()
    .from(destinationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(destinationsTable.rating);

  res.json(ListDestinationsResponse.parse(destinations));
});

router.get("/destinations/featured", async (_req, res): Promise<void> => {
  const destinations = await db
    .select()
    .from(destinationsTable)
    .orderBy(destinationsTable.rating)
    .limit(6);

  res.json(ListFeaturedDestinationsResponse.parse(destinations));
});

router.get("/destinations/:id", async (req, res): Promise<void> => {
  const params = GetDestinationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [destination] = await db
    .select()
    .from(destinationsTable)
    .where(eq(destinationsTable.id, params.data.id));

  if (!destination) {
    res.status(404).json({ error: "Destination not found" });
    return;
  }

  res.json(GetDestinationResponse.parse(destination));
});

export default router;
