import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

const products = [
  { name: "Aurora Sunset Lamp", category: "Ambient Lighting", price: 2500, stock: 25, badge: "Bestseller",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
    description: "Create a warm sunset atmosphere in your room." },
  { name: "Galaxy Projector", category: "Ambient Lighting", price: 4500, stock: 15, badge: "Popular",
    imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80",
    description: "Bring a dreamy night sky into your space." },
  { name: "Mushroom Table Lamp", category: "Decorative Lamps", price: 4000, stock: 12, badge: "",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
    description: "A sculptural lamp for a cozy bedside setup." },
  { name: "Luna Bedside Light", category: "Decorative Lamps", price: 3000, stock: 30, badge: "New",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
    description: "Soft lighting for your evening routine." },
  { name: "Minimalist Ceramic Vase", category: "Room Decor", price: 2200, stock: 20, badge: "",
    imageUrl: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80",
    description: "A simple decorative accent for shelves and tables." },
  { name: "Decorative Accent Lamp", category: "Decorative Lamps", price: 3500, stock: 18, badge: "",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
    description: "A modern light to finish your favorite corner." },
];

await connectDB();
await Product.deleteMany({});
const created = await Product.insertMany(products);
console.log(`Seeded ${created.length} products`);
await mongoose.disconnect();
