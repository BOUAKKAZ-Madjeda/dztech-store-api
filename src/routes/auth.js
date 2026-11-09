import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiters.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", loginLimiter, asyncHandler(login));

export default router;
