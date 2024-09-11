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

//UPDATE played list with new game
router.put("/users/:userId/played", (req, res, next) => {
    const { userId } = req.params;
    const { gameId } = req.body;
  
    User.findById(userId)
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found." });
  
        if (user.played.includes(gameId)) {
          return res.status(400).json({ message: "Game already added to played list." });
        }
  
        user.played.push(gameId);

        user.wishlist = user.wishlist.filter((id) => id.toString() !== gameId);
  
        return user.save();
      })
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => next(error));
  });

// UPDATE wishlist with new game
router.put("/users/:userId/wishlist", (req, res, next) => {
    const { userId } = req.params;
    const { gameId } = req.body;
  
    User.findById(userId)
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found." });
  
        if (user.played.includes(gameId)) {
          return res.status(400).json({ message: "Game already in played list, cannot add to wishlist." });
        }
  
        if (user.wishlist.includes(gameId)) {
          return res.status(400).json({ message: "Game already in wishlist." });
        }
  
        user.wishlist.push(gameId);
  
        return user.save();
      })
      .then((updatedUser) => res.json(updatedUser))
      .catch((error) => next(error));
  });

// DELETE from played list
router.delete("/users/:userId/played/:gameId", (req, res, next) => {
    const { userId, gameId } = req.params;

    User.findByIdAndUpdate(
        userId,
        { $pull: { played: gameId } }, // $pull removes the gameId from the played array
        { new: true } // Returns the updated document
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.json(updatedUser);
        })
        .catch((error) => next(error));
});

// DELETE from wishlist
router.delete("/users/:userId/wishlist/:gameId", (req, res, next) => {
    const { userId, gameId } = req.params;

    User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: gameId } }, 
        { new: true } 
    )
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.json(updatedUser);
        })
        .catch((error) => next(error));
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