import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiters.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
// register function is wrapped with asyncHandler to catch any errors that occur during the registration process and forward them to the Express error handling middleware.
router.post("/login", loginLimiter, asyncHandler(login));
// loginlimiter is applied to the login route to limit the number of login attempts from a single IP address within a specified time frame, 
// and the login function is wrapped with asyncHandler to catch any errors that occur during the login process and forward them to the Express error handling middleware.
export default router;
