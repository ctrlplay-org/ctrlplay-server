const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Review title is required."],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date created is required."],
    },
    description: String,
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: Number,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
