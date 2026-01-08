import express from "express";
import { authenticateMerchant } from "../middlewares/auth.middleware.js";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", authenticateMerchant, createPayment);

export default router;
