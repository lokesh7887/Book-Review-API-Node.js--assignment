import Joi from "joi"

/**
 * Validation schemas for API requests
 */
export const validationSchemas = {
  // Auth validation schemas
  auth: {
    signup: Joi.object({
      username: Joi.string().min(3).max(30).required().message({
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "any.required": "Username is required",
      }),
      email: Joi.string().email().required().message({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string()
        .min(6)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .message({
          "string.min": "Password must be at least 6 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
          "any.required": "Password is required",
        }),
    }),
    login: Joi.object({
      email: Joi.string().email().required().message({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().required().message({
        "any.required": "Password is required",
      }),
    }),
  },

  // Book validation schemas
  book: {
    create: Joi.object({
      title: Joi.string().min(1).max(200).required().message({
        "string.min": "Title cannot be empty",
        "string.max": "Title cannot exceed 200 characters",
        "any.required": "Title is required",
      }),
      author: Joi.string().min(1).max(100).required().message({
        "string.min": "Author name cannot be empty",
        "string.max": "Author name cannot exceed 100 characters",
        "any.required": "Author is required",
      }),
      genre: Joi.string().max(50).message({
        "string.max": "Genre cannot exceed 50 characters",
      }),
      description: Joi.string().max(2000).message({
        "string.max": "Description cannot exceed 2000 characters",
      }),
    }),
    update: Joi.object({
      title: Joi.string().min(1).max(200).message({
        "string.min": "Title cannot be empty",
        "string.max": "Title cannot exceed 200 characters",
      }),
      author: Joi.string().min(1).max(100).message({
        "string.min": "Author name cannot be empty",
        "string.max": "Author name cannot exceed 100 characters",
      }),
      genre: Joi.string().max(50).message({
        "string.max": "Genre cannot exceed 50 characters",
      }),
      description: Joi.string().max(2000).message({
        "string.max": "Description cannot exceed 2000 characters",
      }),
    }),
  },

  // Review validation schemas
  review: {
    create: Joi.object({
      rating: Joi.number().min(1).max(5).required().message({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot exceed 5",
        "any.required": "Rating is required",
      }),
      comment: Joi.string().max(1000).message({
        "string.max": "Comment cannot exceed 1000 characters",
      }),
    }),
    update: Joi.object({
      rating: Joi.number().min(1).max(5).message({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot exceed 5",
      }),
      comment: Joi.string().max(1000).message({
        "string.max": "Comment cannot exceed 1000 characters",
      }),
    }),
  },

  // Search validation schema
  search: Joi.object({
    q: Joi.string().min(1).required().message({
      "string.min": "Search query cannot be empty",
      "any.required": "Search query is required",
    }),
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
  }),

  // Pagination validation schema
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),

  // MongoDB ObjectId validation
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .message({
      "string.pattern.base": "Invalid ID format",
    }),
}
