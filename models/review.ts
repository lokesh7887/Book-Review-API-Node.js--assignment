import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
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

// Compound index to ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true })

// Update the updatedAt field on save
reviewSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Check if model already exists to prevent overwriting during hot reloads
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)

export default Review
