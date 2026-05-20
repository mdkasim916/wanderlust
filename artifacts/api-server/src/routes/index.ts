import { Router, type IRouter } from "express";
import healthRouter from "./health";
import destinationsRouter from "./destinations";
import bookingsRouter from "./bookings";
import testimonialsRouter from "./testimonials";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(destinationsRouter);
router.use(bookingsRouter);
router.use(testimonialsRouter);
router.use(statsRouter);

export default router;
