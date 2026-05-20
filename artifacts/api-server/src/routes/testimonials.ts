import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { ListTestimonialsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(testimonialsTable.createdAt);

  res.json(ListTestimonialsResponse.parse(testimonials.map(t => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
  }))));
});

export default router;
