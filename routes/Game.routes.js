
const router = require('express').Router();

const { isAuthenticated } = require('../middleware/jwt.middleware');
// const mongoose = require("mongoose");

const Game = require('../models/Game.model');
const Review = require('../models/Review.model');
const User = require('../models/User.model');

const fileUploader = require("../config/cloudinary.config");

// CREATE a new game

router.post("/games", isAuthenticated, (req, res, next) => {
    Game.create(req.body)
        .then(game => {
            return User.findByIdAndUpdate(
                req.body.publishers,
                { $push: { games: game._id } },
                { new: true, useFindAndModify: false }
            ).then(() => {
                res.status(201).json(game);
            });
        })
        .catch(error => next(error));
});

// GET all games

router.get("/games", (req, res, next) => {
    Game.find({})
        .populate("publishers")
        .populate("reviews")
        .then((games) => res.json(games))
        .catch(error => next(error));
});

// GET game for specific publisher ID

router.get("/games/publisher/:publisherId", (req, res, next) => {
    const { publisherId } = req.params;
    Game.find({ publishers: publisherId })
        .populate("reviews")
        .then((games) => res.json(games))
        .catch(error => next(error));
});

// GET games if featured is true

router.get("/games/featured", (req, res, next) => {
    Game.find({ isFeatured: true })
        .populate("publishers")
        .populate("reviews")
        .then((games) => res.json(games))
        .catch(error => next(error))
});

// GET game for specific game ID

router.get("/games/:gameId", (req, res, next) => {
    const { gameId } = req.params;
    Game.findById(gameId)
        .populate("publishers")
        .populate("reviews")
        .then((game) => res.json(game))
        .catch(error => next(error));
});


// UPDATE game for specific game ID

router.put("/games/:gameId", isAuthenticated, (req, res, next) => {
    const { gameId } = req.params;
    Game.findByIdAndUpdate(gameId, req.body, { new: true })
        .then((game) => res.json(game))
        .catch(error => next(error));
});


// DELETE game for specific game ID

router.delete("/games/:gameId", isAuthenticated, (req, res, next) => {
    const { gameId } = req.params;
    Game.findByIdAndDelete(gameId)
    .then(game => {
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        return Review.deleteMany({ game: gameId });
    })
    .then(() => {
        return User.updateMany(
            { games: gameId },
            { $pull: { games: gameId } }
        );
    })
    .then(() => {
        res.status(200).json({ message: "Game successfully deleted" });
    })
    .catch(error => {
        next(error);
    });
});

// POST image to cloudinary

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
   
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    
    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
    
    res.json({ fileUrl: req.file.path });
  });

module.exports = router;