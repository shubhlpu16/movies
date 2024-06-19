const express = require('express');
const Movies = require('../models/movie');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/movies', auth, async (req, res) => {
     const { movieIds } = req.body;
     console.log("🚀 ~ router.post ~ movieIds:", movieIds)
     try {
        // let movieList = await Movies.findOne({ user: req.user });

        // if (!movieList) {
           const movieList = new Movies({ user: req.user, movieIds });
        // } else {
        //     movieList.movieIds.push(...movieIds);
        // }

        await movieList.save();
        res.status(201).json({ message: 'Movies added successfully', movieList });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movies', error });
    }

    })

router.get('/movies', auth, async (req, res) => {
    try {
        const movieList = await Movies.findOne({ user: req.user });
        if (!movieList) {
            return res.status(404).json({ message: 'No movies found' });
        }
        res.json(movieList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error });
    }
})

module.exports = router;
