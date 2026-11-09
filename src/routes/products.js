import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProducts)); // public
router.get("/:id", asyncHandler(getProduct)); // public
router.post("/", protect, asyncHandler(createProduct)); // JWT
router.put("/:id", protect, asyncHandler(updateProduct)); // JWT
router.delete("/:id", protect, asyncHandler(deleteProduct)); // JWT

export default router;
