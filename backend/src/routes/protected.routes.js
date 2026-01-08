import express from "express";
import { authenticateMerchant } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticateMerchant, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    merchant: req.merchant
  });
});

export default router;
