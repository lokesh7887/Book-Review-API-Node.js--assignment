import express from "express"
import { updateReview, deleteReview, getUserReviews } from "../controllers/review-controller"
import { validateRequest } from "../middleware/validate-request"
import { validationSchemas } from "../utils/validation"
import { authenticateToken } from "../middleware/auth-middleware"
import Joi from "joi"

const router = express.Router()

/**
 * @route   GET /api/reviews/user
 * @desc    Get all reviews by the current user
 * @access  Private
 */
router.get("/user", authenticateToken, getUserReviews)

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private
 */
router.put(
  "/:id",
  authenticateToken,
  validateRequest(Joi.object({ id: validationSchemas.objectId }), "params"),
  validateRequest(validationSchemas.review.update),
  updateReview,
)

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private
 */
router.delete(
  "/:id",
  authenticateToken,
  validateRequest(Joi.object({ id: validationSchemas.objectId }), "params"),
  deleteReview,
)

export default router
