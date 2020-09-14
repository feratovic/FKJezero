const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    position: {
        type: String,
        required: true
    },
    number: {
        type: String,
    },
    age: {
        type: String,
        required: true
    },
    games: {
        type: String,
        default: 0
    },
    goals: {
        type: String,
        default: 0
    },
    redCartons: {
        type: String,
        default: 0
    },
    yellowCartons: {
        type: String,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Player = mongoose.model('Player', PlayerSchema);

module.exports = Player;