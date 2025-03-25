import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://mukilanp:mukilan@cluster0.n752n.mongodb.net/fraudDB";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
