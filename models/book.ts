import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    trim: true,
    default: "Uncategorized",
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
bookSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Check if model already exists to prevent overwriting during hot reloads
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema)

export default Book
