import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env");
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

// This function connects to the MongoDB database using the Mongoose library. 
// It retrieves the connection URI from the environment variables and establishes a connection. 
// If the URI is not defined, it throws an error. Upon successful connection, it logs the name of the connected database.