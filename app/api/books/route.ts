import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Book from "@/models/book"
import { authenticateToken } from "@/middleware/auth"

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { title, author, genre, description } = await request.json()

    // Validate input
    if (!title || !author) {
      return NextResponse.json({ error: "Title and author are required" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Create new book
    const newBook = new Book({
      title,
      author,
      genre: genre || "Uncategorized",
      description: description || "",
    })

    await newBook.save()

    return NextResponse.json(
      {
        message: "Book added successfully",
        book: newBook,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const author = searchParams.get("author")
    const genre = searchParams.get("genre")

    // Build query
    const query: any = {}
    if (author) query.author = new RegExp(author, "i")
    if (genre) query.genre = new RegExp(genre, "i")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get books with pagination
    const books = await Book.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query)

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
    console.error("Get books error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
