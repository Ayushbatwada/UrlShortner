'use strict';

const express = require('express');
const urlShortenerController = require('./controller');

const router = express.Router();

router.post('/create', urlShortenerController.createShortUrl);

module.exports = router;
