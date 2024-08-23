'use strict';

const urlShortenerModel = require('./model');
const urlShortenerConfig = require('./config.json');
const responseData = require('../utils/responseData');
const sanityChecks = require('../utils/sanityChecks');
const { nanoid } = require('nanoid');

module.exports = {
    getLongUrl: (body, callback) => {
        const shortId = body.shortId;
        let response;
        if (!shortId) {
            response = new responseData.payloadError();
            return callback(null, response);
        }
        try {
            const filterQuery = {
                shortId: shortId,
                status: urlShortenerConfig.status.active
            }
            const updateQuery = {
                $inc: { accessCount : 1 }
            }
            urlShortenerModel.findOneAndUpdate(filterQuery, updateQuery, (err, queryResp) => {
                if (err) {
                    console.log('ERROR: found in "getLongUrl" service error block with err: ', JSON.stringify(err));
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (queryResp && queryResp.longUrl) {
                    response = new responseData.successMessage();
                    response.data = {
                        longUrl: queryResp.longUrl
                    }
                    return callback(null, response);
                } else {
                    console.log('ERROR: found in "getLongUrl" service generic error block');
                    response = new responseData.genericFailureError();
                    return callback(null, response);
                }
            })
        } catch(err) {
            console.log('ERROR: error in "getLongUrl" service catch block with err: ', err);
            response = new responseData.serverError();
            return callback(null, response);
        }
    },

    createShortUrl: (body ,callback) => {
        const longUrl = body.longUrl;
        const title = body.title;
        const description = body.description;
        const image = body.image;
        const shortId = body.shortId;
        const hasExpiry = body.hasExpiry || false;

        let response;
        if (!longUrl) {
            console.log('ERROR ::: Missing info in "createShortUrl" service, longUrl: ' + longUrl);
            response = new responseData.payloadError();
            return callback(null, response);
        }
        try {
            const shortUrl = new urlShortenerModel();
            shortUrl.longUrl = longUrl;
            shortUrl.shortId = shortId;
            shortUrl.title = title;
            shortUrl.description = description;
            shortUrl.image = image;
            shortUrl.hasExpiry = hasExpiry;

            if (sanityChecks.isValidString(shortId)) {
                shortUrl.isCustomShortId = true;
            } else {
                shortUrl.isCustomShortId = false;
                shortUrl.shortId = nanoid(urlShortenerConfig.shortIdLength);
            }

            shortUrl.shortUrl = serverBaseUrl + shortUrl.shortId;

            shortUrl.save().then((resp) => {
                response = new responseData.successMessage();
                if (resp.shortUrl) {
                    response.data = {
                        shortUrl: resp.shortUrl
                    };
                }
                return callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createShortUrl" service generic error block with err: ', JSON.stringify(err))
                response = new responseData.serverError();
                return callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in "createShortUrl" service catch block with err: ', JSON.stringify(err))
            response = new responseData.serverError();
            return callback(null, response);
        }
    }
}
