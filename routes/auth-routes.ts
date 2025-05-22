import express from "express"
import { signup, login, getProfile } from "../controllers/auth-controller"
import { validateRequest } from "../middleware/validate-request"
import { validationSchemas } from "../utils/validation"
import { authenticateToken } from "../middleware/auth-middleware"

const router = express.Router()

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validateRequest(validationSchemas.auth.signup), signup)

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/login", validateRequest(validationSchemas.auth.login), login)

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticateToken, getProfile)

export default router
