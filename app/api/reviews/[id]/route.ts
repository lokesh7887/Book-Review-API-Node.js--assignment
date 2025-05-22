import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Review from "@/models/review"
import { authenticateToken } from "@/middleware/auth"
import mongoose from "mongoose"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.userId
    const reviewId = params.id

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    const { rating, comment } = await request.json()

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return NextResponse.json({ error: "You can only update your own reviews" }, { status: 403 })
    }

    // Update review
    if (rating) review.rating = rating
    if (comment !== undefined) review.comment = comment

    await review.save()

    return NextResponse.json({
      message: "Review updated successfully",
      review,
    })
  } catch (error) {
    console.error("Update review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.userId
    const reviewId = params.id

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Find review
    const review = await Review.findById(reviewId)

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return NextResponse.json({ error: "You can only delete your own reviews" }, { status: 403 })
    }

    // Delete review
    await Review.findByIdAndDelete(reviewId)

    return NextResponse.json({
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error("Delete review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
