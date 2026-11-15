import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { getReviews, createReview } from "../controllers/reviewController.js";
import { protect, requireLocalUser, requireSeller } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProducts)); // public
router.get("/:id", asyncHandler(getProduct)); // public
router.post("/", protect, requireSeller, asyncHandler(createProduct)); // seller
router.put("/:id", protect, requireSeller, asyncHandler(updateProduct)); // seller
router.delete("/:id", protect, requireSeller, asyncHandler(deleteProduct)); // seller

router.get("/:id/reviews", asyncHandler(getReviews)); // public
router.post("/:id/reviews", protect, requireLocalUser, asyncHandler(createReview)); // customer

export default router;
