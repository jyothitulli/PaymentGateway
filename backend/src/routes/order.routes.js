import express from "express";
import { authenticateMerchant } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrderById
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authenticateMerchant, createOrder);
router.get("/:order_id", authenticateMerchant, getOrderById);

export default router;
