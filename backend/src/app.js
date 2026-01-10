// import express from "express";
// import healthRouter from "./routes/health.routes.js";
// import orderRouter from "./routes/order.routes.js";
// import paymentRouter from "./routes/payment.routes.js";
// import publicRouter from "./routes/public.routes.js";

// const app = express();

// app.use(express.json());

// app.use("/health", healthRouter);
// app.use("/api/v1/orders", orderRouter);
// app.use("/api/v1/payments", paymentRouter);

// app.use("/api/v1/public", publicRouter);

// export default app;
import express from "express";
import cors from "cors";

import healthRouter from "./routes/health.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import publicRouter from "./routes/public.routes.js";

const app = express();

// ✅ ENABLE CORS FOR ALL ORIGINS (REQUIRED FOR FRONTEND)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/public", publicRouter);

export default app;