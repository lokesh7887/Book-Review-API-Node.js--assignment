import type { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../utils/api-response"
import { logger } from "../utils/logger"

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number
  errors?: any

  constructor(message: string, statusCode: number, errors?: any) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, err)

  // Handle mongoose duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    return ApiResponse.error(res, message, 409)
  }

  // Handle mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values((err as any).errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }))
    return ApiResponse.error(res, "Validation error", 400, errors)
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors)
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.error(res, "Invalid token", 401)
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.error(res, "Token expired", 401)
  }

  // Default to 500 server error
  const statusCode = 500
  const message =
    process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Something went wrong"

  return ApiResponse.error(res, message, statusCode)
}
