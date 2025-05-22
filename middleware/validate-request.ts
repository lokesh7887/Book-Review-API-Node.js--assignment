import type { Request, Response, NextFunction } from "express"
import type Joi from "joi"
import { ApiResponse } from "../utils/api-response"

/**
 * Middleware to validate request data against a Joi schema
 */
export const validateRequest = (schema: Joi.ObjectSchema, property: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }))

      return ApiResponse.error(res, "Validation error", 400, errorMessages)
    }

    // Replace request data with validated data
    req[property] = value
    next()
  }
}
