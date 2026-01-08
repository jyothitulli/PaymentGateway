import express from "express";
import { getPublicOrder } from "../controllers/public.controller.js";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/orders/:order_id", getPublicOrder);
router.post("/payments", createPayment);

export default router;
