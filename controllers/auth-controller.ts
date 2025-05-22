import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import User from "../models/user-model"
import { ApiResponse } from "../utils/api-response"
import { ApiError } from "../middleware/error-handler"

/**
 * User registration controller
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError("Email already in use", 409)
      } else {
        throw new ApiError("Username already taken", 409)
      }
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    })

    await newUser.save()

    // Return success without exposing password
    return ApiResponse.success(
      res,
      {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      "User registered successfully",
      201,
    )
  } catch (error) {
    next(error)
  }
}

/**
 * User login controller
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Find user by email with password included
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      throw new ApiError("Invalid credentials", 401)
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 401)
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    })

    // Return token and user info
    return ApiResponse.success(
      res,
      {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      "Login successful",
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User is already authenticated via middleware
    const userId = req.user?.userId

    const user = await User.findById(userId)

    if (!user) {
      throw new ApiError("User not found", 404)
    }

    return ApiResponse.success(
      res,
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      "User profile retrieved successfully",
    )
  } catch (error) {
    next(error)
  }
}
