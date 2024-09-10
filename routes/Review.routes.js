
const router = require('express').Router();

const { isAuthenticated } = require('../middleware/jwt.middleware');
const Game = require('../models/Game.model');
// const mongoose = require("mongoose");

const Review = require('../models/Review.model');

// POST a new review

router.post("/reviews", isAuthenticated, (req, res, next) => {
    
    const author = req.payload?._id;

    
    if (!author) {
        return res.status(400).json({ message: 'Author not authenticated' });
    }

    
    const { title, description, rating, game } = req.body;

    
    Review.create({ title, description, rating, game, author })
        .then(review => {
            return Game.findByIdAndUpdate(
                req.body.game,
                { $push: { reviews: review._id } },
                { new: true, useFindAndModify: false }
            ).then(() => {
                res.status(201).json(review);
            });
        })
        .catch(error => {
            console.error(error); 
            next(error);
        });
});





// GET all reviews

router.get("/reviews", (req, res, next) => {
    Review.find({})
        .populate("author")
        .then((reviews) => res.json(reviews))
        .catch(error => next(error));
});

// GET reviews for specific game ID

router.get("/reviews/game/:gameId", (req, res, next) => {
    const { gameId } = req.params;
    Review.find({ game: gameId })
        .populate("author")
        .then((reviews) => res.json(reviews))
        .catch(error => next(error));
});

// GET review for specific review ID

router.get("/reviews/:reviewId", (req, res, next) => {
    const { reviewId } = req.params;
    Review.findById(reviewId)
        .populate("author")
        .then((review) => res.json(review))
        .catch(error => next(error));
});

// UPDATE review for specific review ID

router.put("/reviews/:reviewId", isAuthenticated, (req, res, next) => {
    const { reviewId } = req.params;
    Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        .then((review) => res.json(review))
        .catch(error => next(error));
});


// DELETE review for specific review ID

// DELETE review for specific review ID
router.delete("/reviews/:reviewId", isAuthenticated, (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.payload._id;

    // Find the review by ID
    Review.findById(reviewId)
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            // Check if the current user is the author of the review
            if (review.author.toString() !== userId.toString()) {
                return res.status(403).json({ message: "You are not authorized to delete this review" });
            }
            // Proceed to delete the review if the user is the author
            return Review.findByIdAndDelete(reviewId)
                .then(() => {
                    return Game.findOneAndUpdate(
                        { reviews: reviewId },
                        { $pull: { reviews: reviewId } }
                    );
                })
                .then(() => res.status(204).send())
                .catch(error => next(error));
        })
        .catch(error => next(error));
});


module.exports = router;