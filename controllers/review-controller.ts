import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import Book from "../models/book-model"
import Review from "../models/review-model"
import { ApiResponse } from "../utils/api-response"
import { ApiError } from "../middleware/error-handler"

/**
 * Submit a new review for a book
 */
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const bookId = req.params.bookId
    const { rating, comment } = req.body

    // Validate book ID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new ApiError("Invalid book ID", 400)
    }

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      throw new ApiError("Book not found", 404)
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId,
    })

    if (existingReview) {
      throw new ApiError("You have already reviewed this book", 409)
    }

    // Create new review
    const newReview = new Review({
      bookId,
      userId,
      rating,
      comment: comment || "",
    })

    await newReview.save()

    // Populate user information
    await newReview.populate("userId", "username email")

    return ApiResponse.success(res, { review: newReview }, "Review submitted successfully", 201)
  } catch (error) {
    next(error)
  }
}

/**
 * Update an existing review
 */
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const reviewId = req.params.id
    const { rating, comment } = req.body

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError("Invalid review ID", 400)
    }

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      throw new ApiError("Review not found", 404)
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      throw new ApiError("You can only update your own reviews", 403)
    }

    // Update review
    if (rating !== undefined) review.rating = rating
    if (comment !== undefined) review.comment = comment

    await review.save()

    // Populate user information
    await review.populate("userId", "username email")

    return ApiResponse.success(res, { review }, "Review updated successfully")
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a review
 */
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const reviewId = req.params.id

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError("Invalid review ID", 400)
    }

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      throw new ApiError("Review not found", 404)
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      throw new ApiError("You can only delete your own reviews", 403)
    }

    // Delete review
    await Review.findByIdAndDelete(reviewId)

    return ApiResponse.success(res, null, "Review deleted successfully")
  } catch (error) {
    next(error)
  }
}

/**
 * Get all reviews by a user
 */
export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    // Get reviews by this user
    const reviews = await Review.find({ userId }).populate("bookId", "title author").sort({ createdAt: -1 })

    return ApiResponse.success(res, { reviews }, "User reviews retrieved successfully")
  } catch (error) {
    next(error)
  }
}
