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
    date: {
      type: Date,
      required: [true, "Date created is required."],
    },
    genre: Array,
    platforms: Array,
    publishers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
