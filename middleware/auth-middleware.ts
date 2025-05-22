import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import { ApiResponse } from "../utils/api-response"
import { logger } from "../utils/logger"

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
      }
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return ApiResponse.error(res, "Authentication token is required", 401)
    }

    // Verify token
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        logger.error("JWT verification error:", err)

        if (err.name === "TokenExpiredError") {
          return ApiResponse.error(res, "Token expired", 401)
        }

        return ApiResponse.error(res, "Invalid token", 401)
      }

      // Add user data to request
      req.user = decoded as { userId: string; email: string }
      next()
    })
  } catch (error) {
    logger.error("Authentication error:", error)
    return ApiResponse.error(res, "Authentication failed", 500)
  }
}
