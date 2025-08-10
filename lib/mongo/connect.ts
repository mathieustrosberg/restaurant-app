import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const cached: MongooseCache = (global as unknown as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };

export async function mongoConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI!;
    cached.promise = mongoose.connect(uri).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

(global as unknown as { mongoose?: MongooseCache }).mongoose = cached;


