'use strict';

const mongoose = require('mongoose');
const urlShortenerConfig = require('./config.json');

const urlShortenerSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true
    },
    isCustomShortId: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: urlShortenerConfig.status.active,
        enum: urlShortenerConfig.status.values
    },
    hasExpiry: {
        type: Boolean,
        default: false
    },
    expireOn: {
        type: Date
    },
    accessCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

urlShortenerSchema.index({shortId: 1});
urlShortenerSchema.index({status: 1});
module.exports = mongoose.model('url_shortener', urlShortenerSchema);
