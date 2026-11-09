import mongoose from "mongoose";
import Product from "../models/Product.js";

const FIELDS = ["name", "description", "price", "category", "imageUrl", "stock", "badge"];
const pick = (body = {}) =>
  Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

const checkId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid product ID" });
    return false;
  }
  return true;
};

export async function getProducts(_req, res) {
  const products = await Product.find().sort({ createdAt: 1 });
  res.status(200).json(products);
}

export async function getProduct(req, res) {
  if (!checkId(req.params.id, res)) return;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
}

export async function createProduct(req, res) {
  const product = await Product.create(pick(req.body));
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  if (!checkId(req.params.id, res)) return;
  const data = pick(req.body);
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
}

export async function deleteProduct(req, res) {
  if (!checkId(req.params.id, res)) return;
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json({ message: "Product deleted" });
}
