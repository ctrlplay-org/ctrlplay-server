const router = require('express').Router();
const User = require('../models/User.model');
const Game = require('../models/Game.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get("/users/:userId", (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
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


  


router.get('/search/suggestions', async (req, res, next) => {
    const { query } = req.query;

    try {
        // Find games and users that match the query
        const games = await Game.find({ name: new RegExp(query, 'i') }).limit(10); 
        const users = await User.find({ name: new RegExp(query, 'i') }).limit(10);

        // Combine games and users into a single list of suggestions
        const suggestions = [
            ...games.map(game => ({ type: 'game', ...game.toObject() })),
            ...users.map(user => ({ type: 'user', ...user.toObject() }))
        ];

        // Return combined list of suggestions
        res.json(suggestions);
    } catch (error) {
        next(error);
    }
});





module.exports = router;