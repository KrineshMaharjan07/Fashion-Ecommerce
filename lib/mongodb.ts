// ============================================================
// lib/mongodb.ts — MongoDB connection with caching
// Caches the connection across hot-reloads in development
// ============================================================
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define MONGODB_URI in your .env.local file.\n' +
    'Get it from: https://cloud.mongodb.com → Connect → Drivers'
  );
}

// In development, use a cached connection to avoid exhausting connections
// on every hot-reload. In production, a new connection is fine.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
