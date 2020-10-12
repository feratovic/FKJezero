const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    contentType: {
        type: String
    },
    image: {
        type: Buffer
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;