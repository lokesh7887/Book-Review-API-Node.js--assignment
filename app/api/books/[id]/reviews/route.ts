import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Book from "@/models/book"
import Review from "@/models/review"
import { authenticateToken } from "@/middleware/auth"
import mongoose from "mongoose"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.userId
    const bookId = params.id

    // Validate book ID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })
    }

    const { rating, comment } = await request.json()

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating is required and must be between 1 and 5" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this book" }, { status: 409 })
    }

    // Create new review
    const newReview = new Review({
      bookId,
      userId,
      rating,
      comment: comment || "",
    })

    await newReview.save()

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: newReview,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Submit review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
