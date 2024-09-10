const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  date: { type: Date, default: Date.now },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
