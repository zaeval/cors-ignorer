var express = require('express');
const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

var router = express.Router();

/* GET home page. */
router.get('/*', async function (req, res, next) {
    const url = req.path.slice(1);
    const headers = req.headers;
    try {
        headers["origin"] = new URL(url).origin;
        headers["host"] = new URL(url).host;

        const response = await fetch(url, {headers: headers, agent: httpsAgent, method: 'GET'});
        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        for (key in responseHeaders) {
            res.set(key, responseHeaders[key][0]);
        }
        res.send(responseData);
    } catch {
        res.send("");
    }

});

router.post('/*', async function (req, res, next) {
    const url = req.path.slice(1);
    const headers = req.headers;
    try {
        headers["origin"] = new URL(url).origin;
        headers["host"] = new URL(url).host;

        const response = await fetch(url, {headers: headers, agent: httpsAgent, method: 'POST', body: JSON.parse(JSON.stringify(req.body))});
        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        for (key in responseHeaders) {
            res.set(key, responseHeaders[key][0]);
        }
        res.send(responseData);
    } catch(e) {
        console.log(e.message);
        res.send("");
    }
});
module.exports = router;
