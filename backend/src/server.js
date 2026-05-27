import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";

import { errorHandler } from "./middleware/error.middleware.js";
import {
  globalLimiter,
  sensitiveRouteLimiter,
} from "./middleware/rateLimiter.middleware.js";
import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";
import userRouter from "./routes/user.route.js";

const app = express();

//  SECURITY MIDDLEWARE
app.use(helmet()); // sets secure HTTP headers
app.set("trust proxy", 1); // Required if behind a reverse proxy

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(express.json({ limit: "10kb" })); // Prevent large payload attacks
app.use(cookieParser());

// GLOBAL RATE LIMITER
app.use(globalLimiter);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", sensitiveRouteLimiter, interviewRouter);
app.use("/api/payment", sensitiveRouteLimiter, paymentRouter);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

//  404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//  GLOBAL ERROR HANDLER
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("Server is running on PORT:", ENV.PORT);
    });
  } catch (error) {
    console.error("[Server] Failed to start:", error.message);
    process.exit(1);
  }
};

// UNGANDLED REJECTION / EXCEPTION GUARDS
process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Exception]", reason);
});

process.on("uncaughtException", (reason) => {
  console.error("[Unhandled Exception]", reason);
  process.exit(1);
});

startServer();

export default app;
