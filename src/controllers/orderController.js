import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const PAYMENT_METHODS = ["cash_on_delivery", "card", "baridimob"];

const restoreStock = (lines) =>
  Promise.all(
    lines.map((l) => Product.updateOne({ _id: l.product }, { $inc: { stock: l.quantity } }))
  );

// POST /api/orders  (logged-in customer)
export async function createOrder(req, res) {
  const { items, paymentMethod, phone, address } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items must be a non-empty array" });
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }
  if (!phone || !address) {
    return res.status(400).json({ message: "phone and address are required" });
  }

  // Merge duplicate products and validate every item
  const wanted = new Map();
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!mongoose.isValidObjectId(item.productId) || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid item in order" });
    }
    const key = String(item.productId);
    wanted.set(key, (wanted.get(key) || 0) + quantity);
  }

  // Reserve stock atomically, product by product (prices always come from the database)
  const reserved = [];
  try {
    for (const [productId, quantity] of wanted) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!product) {
        await restoreStock(reserved);
        const existing = await Product.findById(productId);
        if (!existing) return res.status(404).json({ message: "A product in your cart no longer exists" });
        return res.status(409).json({
          message: `Not enough stock for "${existing.name}" (available: ${existing.stock})`,
        });
      }
      reserved.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
    }

    const total = reserved.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const order = await Order.create({
      user: req.user.id,
      items: reserved,
      total,
      phone,
      address,
      paymentMethod,
      // Online payments are simulated: they are marked as paid immediately
      paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
    });
    return res.status(201).json(order);
  } catch (err) {
    await restoreStock(reserved);
    throw err;
  }
}

// GET /api/orders/mine  (the customer's own orders)
export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
}

// GET /api/orders  (seller: all orders)
export async function getAllOrders(_req, res) {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json(orders);
}

// PATCH /api/orders/:id  (seller confirms or rejects an order, with a message to the customer)
export async function updateOrderStatus(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  const { status, sellerMessage } = req.body || {};
  if (!["confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ message: 'status must be "confirmed" or "rejected"' });
  }
  const message = String(sellerMessage || "").trim().slice(0, 500);
  if (status === "rejected" && !message) {
    return res.status(400).json({ message: "A message is required when rejecting an order" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "pending") {
    return res.status(409).json({ message: "This order was already processed" });
  }

  if (status === "rejected") {
    await restoreStock(order.items);
    if (order.paymentStatus === "paid") order.paymentStatus = "refunded";
  }
  order.status = status;
  order.sellerMessage = message;
  await order.save();
  await order.populate("user", "name email");
  res.status(200).json(order);
}
