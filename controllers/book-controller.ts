import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import Book from "../models/book-model"
import Review from "../models/review-model"
import { ApiResponse } from "../utils/api-response"
import { ApiError } from "../middleware/error-handler"
import { config } from "../config/config"

/**
 * Create a new book
 */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, genre, description } = req.body

    // Create new book
    const newBook = new Book({
      title,
      author,
      genre: genre || "Uncategorized",
      description: description || "",
    })

    await newBook.save()

    return ApiResponse.success(res, { book: newBook }, "Book added successfully", 201)
  } catch (error) {
    next(error)
  }
}

/**
 * Get all books with pagination and filters
 */
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get query parameters
    const page = Number.parseInt(req.query.page as string) || config.pagination.defaultPage
    const limit = Number.parseInt(req.query.limit as string) || config.pagination.defaultLimit
    const author = req.query.author as string
    const genre = req.query.genre as string

    // Build query
    const query: any = {}
    if (author) query.author = new RegExp(author, "i")
    if (genre) query.genre = new RegExp(genre, "i")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get books with pagination
    const books = await Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query)

    return ApiResponse.paginated(res, books, page, limit, totalBooks, "Books retrieved successfully")
  } catch (error) {
    next(error)
  }
}

/**
 * Get book details by ID with reviews
 */
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid book ID", 400)
    }

    // Get book details
    const book = await Book.findById(id)

    if (!book) {
      throw new ApiError("Book not found", 404)
    }

    // Get query parameters for reviews pagination
    const page = Number.parseInt(req.query.page as string) || config.pagination.defaultPage
    const limit = Number.parseInt(req.query.limit as string) || config.pagination.defaultLimit
    const skip = (page - 1) * limit

    // Get reviews for this book with pagination
    const reviews = await Review.find({ bookId: id })
      .populate("userId", "username email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Get total reviews count
    const totalReviews = await Review.countDocuments({ bookId: id })

    // Calculate average rating
    const aggregateResult = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ])

    const averageRating = aggregateResult.length > 0 ? Math.round(aggregateResult[0].averageRating * 10) / 10 : 0

    return ApiResponse.success(
      res,
      {
        book,
        averageRating,
        reviews,
        pagination: {
          total: totalReviews,
          page,
          limit,
          pages: Math.ceil(totalReviews / limit),
          hasNextPage: page * limit < totalReviews,
          hasPrevPage: page > 1,
        },
      },
      "Book details retrieved successfully",
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update a book
 */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const { title, author, genre, description } = req.body

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid book ID", 400)
    }

    // Check if book exists
    const book = await Book.findById(id)

    if (!book) {
      throw new ApiError("Book not found", 404)
    }

    // Update book fields
    if (title) book.title = title
    if (author) book.author = author
    if (genre !== undefined) book.genre = genre
    if (description !== undefined) book.description = description

    await book.save()

    return ApiResponse.success(res, { book }, "Book updated successfully")
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a book
 */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid book ID", 400)
    }

    // Check if book exists
    const book = await Book.findById(id)

    if (!book) {
      throw new ApiError("Book not found", 404)
    }

    // Delete book
    await Book.findByIdAndDelete(id)

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: id })

    return ApiResponse.success(res, null, "Book and associated reviews deleted successfully")
  } catch (error) {
    next(error)
  }
}
