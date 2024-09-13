const express = require("express");
const router = express.Router();
const Game = require("../models/Game.model")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get('/health', (req, res) => {

  Game.find().then().catch();

  res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
  });
});

module.exports = router;
