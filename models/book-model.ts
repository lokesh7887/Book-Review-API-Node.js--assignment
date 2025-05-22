import mongoose, { type Document, Schema } from "mongoose"

// Book document interface
export interface IBook extends Document {
  title: string
  author: string
  genre: string
  description: string
  createdAt: Date
  updatedAt: Date
}

// Book schema
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      trim: true,
      default: "Uncategorized",
      maxlength: [50, "Genre cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  },
)

// Create text index for search
bookSchema.index({ title: "text", author: "text" })

// Create and export Book model
const Book = mongoose.models.Book || mongoose.model<IBook>("Book", bookSchema)

export default Book
