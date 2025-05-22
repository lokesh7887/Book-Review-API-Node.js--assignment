import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function authenticateToken(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return {
        success: false,
        error: "Authentication token is required",
        status: 401,
      }
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as jwt.JwtPayload

    if (!decoded || !decoded.userId) {
      return {
        success: false,
        error: "Invalid token",
        status: 401,
      }
    }

    // Return user ID from token
    return {
      success: true,
      userId: decoded.userId,
    }
  } catch (error) {
    console.error("Authentication error:", error)

    if ((error as Error).name === "TokenExpiredError") {
      return {
        success: false,
        error: "Token expired",
        status: 401,
      }
    }

    return {
      success: false,
      error: "Invalid token",
      status: 401,
    }
  }
}
