import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Book from "@/models/book"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Calculate pagination
    const skip = (page - 1) * limit

    // Search books by title or author (case-insensitive)
    const books = await Book.find({
      $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Get total count for pagination
    const totalBooks = await Book.countDocuments({
      $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }],
    })

    return NextResponse.json({
      books,
      pagination: {
        total: totalBooks,
        page,
        limit,
        pages: Math.ceil(totalBooks / limit),
      },
    })
  } catch (error) {
    console.error("Search books error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
