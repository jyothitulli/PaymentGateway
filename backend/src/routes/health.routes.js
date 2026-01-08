import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

export default router;
