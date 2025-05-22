import express from "express"
import { searchBooks } from "../controllers/search-controller"
import { validateRequest } from "../middleware/validate-request"
import { validationSchemas } from "../utils/validation"

const router = express.Router()

/**
 * @route   GET /api/search
 * @desc    Search books by title or author
 * @access  Public
 */
router.get("/", validateRequest(validationSchemas.search, "query"), searchBooks)

export default router
