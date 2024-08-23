const healthCheck = require('./server/utils/healthCheck')
const urlShortenerController = require('./server/url-shortener/controller');
const urlShortenerRoutes = require('./server/url-shortener/routes');

module.exports = (app) => {
    app.use('/v1/api/healthCheck', healthCheck);
    app.get('/:shortId', urlShortenerController.getLongUrl);
    app.use('/v1/api/url/short', urlShortenerRoutes);
}
