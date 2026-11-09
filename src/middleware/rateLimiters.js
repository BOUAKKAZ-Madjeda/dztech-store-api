import rateLimit from "express-rate-limit";

const handler = (message) => (_req, res) =>
  res.status(429).json({ message });

// General: 100 requests / 15 min per IP on all /api routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: handler("Too many requests, please try again later."),
});

// Login: 5 requests / 15 min per IP (brute-force protection)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: handler("Too many login attempts, please try again in 15 minutes."),
});
