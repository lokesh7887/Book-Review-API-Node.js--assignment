import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Book from "@/models/book"
import Review from "@/models/review"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Get book details
    const book = await Book.findById(id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Get query parameters for reviews pagination
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Get reviews for this book with pagination
    const reviews = await Review.find({ bookId: id })
      .populate("userId", "username email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Get total reviews count
    const totalReviews = await Review.countDocuments({ bookId: id })

    // Calculate average rating
    const aggregateResult = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ])

    const averageRating = aggregateResult.length > 0 ? Math.round(aggregateResult[0].averageRating * 10) / 10 : 0

    return NextResponse.json({
      book,
      averageRating,
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        pages: Math.ceil(totalReviews / limit),
      },
    })
  } catch (error) {
    console.error("Get book details error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
