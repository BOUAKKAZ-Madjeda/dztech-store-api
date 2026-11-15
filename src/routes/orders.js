import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, requireLocalUser, requireSeller } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.post("/", protect, requireLocalUser, asyncHandler(createOrder)); // customer
router.get("/mine", protect, requireLocalUser, asyncHandler(getMyOrders)); // customer
router.get("/", protect, requireSeller, asyncHandler(getAllOrders)); // seller
router.patch("/:id", protect, requireSeller, asyncHandler(updateOrderStatus)); // seller

export default router;
