import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

const checkId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid product ID" });
    return false;
  }
  return true;
};

// GET /api/products/:id/reviews  (public)
export async function getReviews(req, res) {
  if (!checkId(req.params.id, res)) return;
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json(reviews);
}

// POST /api/products/:id/reviews  (logged-in customer)
export async function createReview(req, res) {
  if (!checkId(req.params.id, res)) return;

  const comment = String(req.body?.comment || "").trim();
  if (!comment) return res.status(400).json({ message: "comment is required" });
  if (comment.length > 500) {
    return res.status(400).json({ message: "comment must be 500 characters or less" });
  }

  let rating;
  const rawRating = req.body?.rating;
  if (rawRating !== undefined && rawRating !== null && rawRating !== "") {
    rating = Number(rawRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be an integer between 1 and 5" });
    }
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user.id).select("name");
  if (!user) return res.status(401).json({ message: "User not found" });

  const review = await Review.create({
    product: product._id,
    user: user._id,
    userName: user.name,
    comment,
    rating,
  });
  res.status(201).json(review);
}
