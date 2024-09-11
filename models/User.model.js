const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    played: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game"
    }],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game"
    }],
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game"
    }],
    isPublisher: Boolean,
    profileImg: { 
      type: String,
      required: true,
      default: "https://res.cloudinary.com/daa7dmuxv/image/upload/v1725871121/profile-image_lqsgmg.jpg",
    },
    bannerImg: { 
      type: String,
      required: true,
      default: "https://res.cloudinary.com/daa7dmuxv/image/upload/v1725870978/profile-banner_xbgjnq.webp",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
