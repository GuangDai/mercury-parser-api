const Router = require('express').Router;
const router = new Router();
const Mercury = require('@postlight/mercury-parser');
const {spawn} = require('child_process');

function request_url (url){
    let dataToSend;
//     console.log(url);
    let p = new Promise(function (resolve){
        const python = spawn('python3', ['request_url.py',url]);
        python.stdout.on('data', function (data) {
            dataToSend = data.toString();
            resolve(dataToSend)
//             console.log(dataToSend);
        });
        python.stderr.on('data',data=>{console.error(`stderr:${data}`);});
        python.on('close', (code) => {
//             console.log("Done");
        });
    })

    return p;
}

router.route('/').get((req, res) => {
    res.json({
        message: 'Welcome to ....mercury-parser-api API! Endpoint: /parser',
    });
});

router.route('/parser').get(async (req, res) => {
    let result = { message: 'No URL was provided' };
    let dataToSend;
    if (req.query.url) {
        if (req.query.url.match(/(\.)google/)) {
            try {
                const contentType = req.query.contentType || 'html';
                let headers = new Object();
                if (typeof req.query.headers !== 'undefined') {
                    headers = JSON.parse(req.query.headers);
                }
                result = await request_url(req.query.url).then(
                    function (data){
                        let results = Mercury.parse(data, {
                            contentType,
                            headers,
                        });
                        return results;
                    }
                );

            } catch (error) {
                result = {error: true, messages: error.message};
            }
        } else {
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
                result = {error: true, messages: error.message};
            }
        }

    }
    return res.json(result);
});

module.exports = router;
