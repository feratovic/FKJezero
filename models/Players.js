const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    number: {
         type: Number,
    },
    age: {
        type: Number,
        required: true
    },
    games: {
        type: Number,
        default: 0
    },
    goals: {
        type: Number,
        default: 0
    },
    redCartons: {
        type: Number,
        default: 0
    },
    yellowCartons: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;