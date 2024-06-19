const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movieIds:{
        type: Array,
    },
});

module.exports = mongoose.model('Movie', movieSchema);