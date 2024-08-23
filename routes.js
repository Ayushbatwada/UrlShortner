module.exports = (app) => {
    app.get('/v1/api/healthCheck', (req, res) => {
        res.status(200).send({status: 'OK'})
    });
}
