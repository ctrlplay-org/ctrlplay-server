const router = require('express').Router();
const User = require('../models/User.model');
const Game = require('../models/Game.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get("/users/:userId", (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
        .populate("games")
        .populate("played")
        .populate("wishlist")
        .then((user) => res.json(user))
        .catch(error => next(error));
});

router.put("/users/:userId/played", (req, res, next) => {
    const { userId } = req.params;
    const { gameId } = req.body;

    User.findById(userId)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found." });

            if (user.played.includes(gameId)) {
                return res.status(400).json({ message: "Game already added to played list." });
            }

            user.played.push(gameId);
            return user.save();
        })
        .then(updatedUser => res.json(updatedUser))
        .catch(error => next(error));
});

router.put("/users/:userId/wishlist", (req, res, next) => {
    const { userId } = req.params;
    const { gameId } = req.body;

    User.findById(userId)
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found." });

            if (user.wishlist.includes(gameId)) {
                return res.status(400).json({ message: "Game already in wishlist." });
            }

            user.wishlist.push(gameId);
            return user.save();
        })
        .then(updatedUser => res.json(updatedUser))
        .catch(error => next(error));
});


router.get('/search', async (req, res, next) => {
    const { query } = req.query;

    try {
        const game = await Game.findOne({ name: new RegExp(query, 'i') });
        const user = await User.findOne({ name: new RegExp(query, 'i') });

        if (game) {
            return res.json({ game });
        }

        if (user) {
            return res.json({ user });
        }

        return res.status(404).json({ message: 'No user found' });
    } catch (error) {
        next(error);
    }
});



module.exports = router;