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

        const response = await fetch(url, {headers: headers, agent: httpsAgent, method: 'GET'});
        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        // for (key in responseHeaders) {
        //     res.set(key, responseHeaders[key][0]);
        // }
        console.log(responseHeaders);
        res.send(responseData);
    } catch {
        res.status(404).send('Something broke!');
    }

});

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}
function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

router.post('/*', async function (req, res, next) {
    const url = req.path.slice(1);
    const headers = req.headers;
    try {
        headers["origin"] = new URL(url).origin;
        headers["host"] = new URL(url).host;

        //TODO: contentType 별로 body 바꿀 것!
        const body = JSON.parse(JSON.stringify(req.body));
        const response = await fetch(url, {
            headers: headers,
            agent: httpsAgent,
            method: 'POST',
            body: jsonToQueryString(body)
        });

        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        // for (key in responseHeaders) {
        //     res.set(key, responseHeaders[key].join(";"));
        // }
        console.log(responseHeaders);
        res.send(responseData);
    } catch (e) {
        res.status(404).send('Something broke!');
    }
});
module.exports = router;
