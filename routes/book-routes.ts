import express from "express"
import Joi from "joi"
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from "../controllers/book-controller"
import { createReview } from "../controllers/review-controller"
import { validateRequest } from "../middleware/validate-request"
import { validationSchemas } from "../utils/validation"
import { authenticateToken } from "../middleware/auth-middleware"

const router = express.Router()

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Private
 */
router.post("/", authenticateToken, validateRequest(validationSchemas.book.create), createBook)

/**
 * @route   GET /api/books
 * @desc    Get all books with pagination and filters
 * @access  Public
 */
router.get("/", validateRequest(validationSchemas.pagination, "query"), getAllBooks)

/**
 * @route   GET /api/books/:id
 * @desc    Get book details by ID
 * @access  Public
 */
router.get(
  "/:id",
  validateRequest(Joi.object({ id: validationSchemas.objectId }), "params"),
  validateRequest(validationSchemas.pagination, "query"),
  getBookById,
)

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Private
 */
router.put(
  "/:id",
  authenticateToken,
  validateRequest(Joi.object({ id: validationSchemas.objectId }), "params"),
  validateRequest(validationSchemas.book.update),
  updateBook,
)

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Private
 */
router.delete(
  "/:id",
  authenticateToken,
  validateRequest(Joi.object({ id: validationSchemas.objectId }), "params"),
  deleteBook,
)

/**
 * @route   POST /api/books/:bookId/reviews
 * @desc    Submit a review for a book
 * @access  Private
 */
router.post(
  "/:bookId/reviews",
  authenticateToken,
  validateRequest(Joi.object({ bookId: validationSchemas.objectId }), "params"),
  validateRequest(validationSchemas.review.create),
  createReview,
)

export default router
