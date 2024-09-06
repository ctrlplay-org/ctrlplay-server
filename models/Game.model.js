const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required."],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year created is required."],
    },
    genre: Array,
    image: String,
    platforms: Array,
    publishers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    isFeatured: Boolean
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
