import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"
import { connectToDatabase } from "./config/database"
import { errorHandler } from "./middleware/error-handler"
import authRoutes from "./routes/auth-routes"
import bookRoutes from "./routes/book-routes"
import reviewRoutes from "./routes/review-routes"
import searchRoutes from "./routes/search-routes"
import { logger } from "./utils/logger"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
})
app.use("/api", apiLimiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/search", searchRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase()

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err)
  // Close server & exit process
  process.exit(1)
})
