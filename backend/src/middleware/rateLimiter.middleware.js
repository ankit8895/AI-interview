import rateLimit from "express-rate-limit";

// GLOBAL RATE LIMITER
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

//  STRICTER LIMITER FOR AI / PAYMENT ROUTES
export const sensitiveRouteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: "Slow down. You're making too many requests." },
});
