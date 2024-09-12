const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  const { email, password, name, isPublisher } = req.body;

  // Validate inputs
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Please provide email, password, and name." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address format." });
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters long and include one number, one lowercase letter, and one uppercase letter." });
  }

  try {
    // Check if email or name already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingUserName = await User.findOne({ name });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({ email, password: hashedPassword, name, isPublisher });
    const { email: userEmail, name: userName, _id, bannerImg, profileImg, isPublisher: userIsPublisher } = newUser;

    res.status(201).json({ user: { email: userEmail, name: userName, _id, bannerImg, profileImg, isPublisher: userIsPublisher } });
  } catch (err) {
    console.error("Signup Error:", err); // Log error details
    next(err);
  }
});

// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const { _id, email: userEmail, name, bannerImg, profileImg, isPublisher } = foundUser;
    const payload = { _id, email: userEmail, name, bannerImg, profileImg, isPublisher };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: "6h" });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error("Login Error:", err); // Log error details
    next(err);
  }
});

// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
