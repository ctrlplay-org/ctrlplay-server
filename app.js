// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const mongoose = require("mongoose");

// Import route paths
const indexRoutes = require("./routes/index.routes");
const gameRoutes = require("./routes/Game.routes");
const reviewRoutes = require("./routes/Review.routes");
const userRoutes = require("./routes/User.routes");
const authRoutes = require("./routes/auth.routes");
const { isAuthenticated } = require("./middleware/jwt.middleware");

// INITIALIZE EXPRESS APP
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
app.use("/api", indexRoutes);
app.use("/api", gameRoutes);
app.use("/api", reviewRoutes);
app.use("/api", userRoutes);
app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// START SERVER

module.exports = app;
