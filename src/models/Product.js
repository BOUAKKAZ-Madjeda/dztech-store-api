import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"], trim: true },
    description: { type: String, trim: true, default: "" },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: [0, "price must be >= 0"],
    },
    category: { type: String, required: [true, "category is required"], trim: true },
    imageUrl: { type: String, trim: true, default: "" },
    stock: { type: Number, min: [0, "stock must be >= 0"], default: 0 },
    badge: { type: String, trim: true, default: "" }, // used by the React UI
  },
  {
    timestamps: true,
    toJSON: {
      // Return `id` instead of `_id` so the React cart (item.id) works unchanged
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("Product", productSchema);
