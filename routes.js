const Router = require('express').Router;
const router = new Router();
const Mercury = require('@postlight/mercury-parser');
const {convert} = require('html-to-text');
router.route('/').get((req, res) => {
    res.json({
        message: 'Welcome to ....mercury-parser-api API! Endpoint: /parser',
    });
});

router.route('/parser').get(async (req, res) => {
    let result = { message: 'No URL was provided' };
    if (req.query.url) {
        try {
            const contentType = req.query.contentType || 'markdown';
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
});

module.exports = router;
