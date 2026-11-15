import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // price at the time of the order
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: {
      type: [itemSchema],
      validate: [(v) => v.length > 0, "an order needs at least one item"],
    },
    total: { type: Number, required: true },
    phone: { type: String, required: [true, "phone is required"], trim: true },
    address: { type: String, required: [true, "address is required"], trim: true },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card", "baridimob"],
      required: true,
    },
    // Online payments are simulated (no real payment gateway in this lab)
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    sellerMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("Order", orderSchema);
