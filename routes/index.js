var express = require('express');
const fetch = require('node-fetch');
const https = require('https');
const FormData = require('form-data');

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
        headers["user-agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36";

        const response = await fetch(url, {headers: headers, agent: httpsAgent, method: 'GET'});
        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        for (key in responseHeaders) {
            res.set(key, responseHeaders[key][0]);
        }
        res.send(responseData);
    } catch {
        console.log(e.message);
        res.send("");
    }

});

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

router.post('/*', async function (req, res, next) {
    const url = req.path.slice(1);
    const headers = req.headers;
    try {
        headers["origin"] = new URL(url).origin;
        headers["host"] = new URL(url).host;
        // headers['contentType'] = 'application/x-www-form-urlencoded';

        const body = JSON.parse(JSON.stringify(req.body));
        console.log(        getFormData(body));
        const response = await fetch(url, {
            headers: headers,
            agent: httpsAgent,
            method: 'POST',
            body: getFormData(body)
        });

        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        for (key in responseHeaders) {
            res.set(key, responseHeaders[key][0]);
        }
        console.log(responseData);
        res.send(responseData);
    } catch (e) {
        console.log(e.message);
        res.send("");
    }
});
module.exports = router;
