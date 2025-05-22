import type { Request, Response, NextFunction } from "express"
import Book from "../models/book-model"
import { ApiResponse } from "../utils/api-response"
import { ApiError } from "../middleware/error-handler"
import { config } from "../config/config"

/**
 * Search books by title or author
 */
export const searchBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get query parameters
    const query = req.query.q as string
    const page = Number.parseInt(req.query.page as string) || config.pagination.defaultPage
    const limit = Number.parseInt(req.query.limit as string) || config.pagination.defaultLimit

    if (!query) {
      throw new ApiError("Search query is required", 400)
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Search books by title or author (case-insensitive)
    const books = await Book.find({
      $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Get total count for pagination
    const totalBooks = await Book.countDocuments({
      $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }],
    })

    return ApiResponse.paginated(res, books, page, limit, totalBooks, "Search results retrieved successfully")
  } catch (error) {
    next(error)
  }
}
