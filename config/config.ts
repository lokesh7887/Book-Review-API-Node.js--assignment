import dotenv from "dotenv"
import { logger } from "../utils/logger"

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"]

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
})

// Configuration object
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  db: {
    uri: process.env.MONGODB_URI!,
  },
  server: {
    port: Number.parseInt(process.env.PORT || "3000", 10),
    env: process.env.NODE_ENV || "development",
  },
  security: {
    bcryptSaltRounds: 10,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // limit each IP to 100 requests per windowMs
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
}
