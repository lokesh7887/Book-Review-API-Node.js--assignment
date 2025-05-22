import mongoose from "mongoose"
import { logger } from "../utils/logger"

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/book-review-api"

// Connection options
const options = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

// Cache connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase() {
  if (cached.conn) {
    logger.info("Using cached database connection")
    return cached.conn
  }

  if (!cached.promise) {
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}`)

    mongoose.set("strictQuery", false)

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => {
        logger.info("Connected to MongoDB successfully")
        return mongoose
      })
      .catch((error) => {
        logger.error("MongoDB connection error:", error)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectFromDatabase() {
  if (cached.conn) {
    logger.info("Disconnecting from MongoDB")
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
  }
}
