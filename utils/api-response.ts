import type { Response } from "express"

/**
 * Standard API response format
 */
export class ApiResponse {
  /**
   * Send a success response
   */
  static success(res: Response, data: any = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    })
  }

  /**
   * Send an error response
   */
  static error(res: Response, message = "An error occurred", statusCode = 500, errors: any = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    })
  }

  /**
   * Send a paginated response
   */
  static paginated(res: Response, data: any[], page: number, limit: number, total: number, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    })
  }
}
