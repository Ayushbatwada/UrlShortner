'use strict';

const urlShortenerService = require('./service');
const responseData = require("../utils/responseData");

module.exports = {
    getLongUrl: (req, res) => {
        const shortId = req.params.shortId;
        try {
            const getLongUrlBody = {
                shortId: shortId
            }
            urlShortenerService.getLongUrl(getLongUrlBody, (err, getLongUrlResponse) => {
                if (err) {
                    return res.render("../public/invalidShortId.html", { shortId: shortId });
                } else {
                    res.redirect(getLongUrlResponse.data.longUrl);
                }
            });
        } catch {
            return res.render("../public/invalidShortId.html", { shortId: shortId });
        }
    },

    createShortUrl: (req, res) => {
        let response;
        try {
           urlShortenerService.createShortUrl(req.body, (err, createShortUrlResponse) => {
                if (err) {
                    console.log('ERROR ::: error in "createShortUrl" controller error block with err: ', JSON.stringify(err))
                    response = new responseData.serverError();
                    return res.status(response.code).send(response);
                } else if (createShortUrlResponse.data.shortUrl) {
                    return res.status(createShortUrlResponse.code).send(createShortUrlResponse);
                } else {
                    console.log('ERROR ::: error in "createShortUrl" controller generic error block');
                    return res.status(createShortUrlResponse.code).send(createShortUrlResponse);
                }
           });
        } catch(err) {
            console.log('ERROR ::: error in "createShortUrl" controller catch block with err: ', JSON.stringify(err))
            response = new responseData.serverError();
            return res.status(response.code).send(response);
        }
    }
}
