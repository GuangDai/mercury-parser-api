const Router = require('express').Router;
const router = new Router();
const Mercury = require('@postlight/mercury-parser');
const {spawn} = require('child_process');

router.route('/').get((req, res) => {
    res.json({
        message: 'Welcome to ....mercury-parser-api API! Endpoint: /parser',
    });
});

router.route('/parser').get(async (req, res) => {
    let result = { message: 'No URL was provided' };
    if (req.query.url) {
        if (req.query.url.match(/(\.)google/)){
            const python = spawn('python', ['request_url.py',req.query.url]);
             python.stdout.on('data', function (data) {
                dataToSend = data.toString();
                console.log(dataToSend);
             });
             python.on('close', (code) => {
                req.query.url = dataToSend;
             });         
        }
        try {
            const contentType = req.query.contentType || 'html';
            let headers = new Object();
            if (typeof req.query.headers !== 'undefined') {
                headers = JSON.parse(req.query.headers);
            }
            result = await Mercury.parse(req.query.url, {
                contentType,
                headers,
            });
        } catch (error) {
            result = { error: true, messages: error.message };
        }
    }
    return res.json(result);
});

module.exports = router;
