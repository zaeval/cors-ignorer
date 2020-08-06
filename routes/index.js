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
        for (key in responseHeaders) {
            if (key != "content-encoding") {
                res.set(key, responseHeaders[key].join(";"));
            }
        }
        // res.set("content-type","application/json");
        const result = {data: responseData, headers: responseHeaders};
        res.json(result);
    } catch (e) {
        res.status(404).send(e.stack);
    }

});

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

function jsonToQueryString(json) {
    return Object.keys(json).map(function (key) {
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
        headers["sec-fetch-site"] = "same-origin";
        headers["x-forwarded-for"] = undefined;
        headers["x-forwarded-port"] = undefined;
        headers["x-forwarded-proto"] = undefined;
        headers["x-request-id"] = undefined;
        headers["x-request-start"] = undefined;
        headers["referer"] = undefined;
        headers["connection"] = undefined;
        headers["connect-time"] = undefined;
        headers["via"] = undefined;
        headers["total-route-time"] = undefined;
        headers["connection"] = "keep-alive";
        //
        // accept: "*/*"
        // accept-encoding: "gzip, deflate, br"
        // accept-language: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
        // content-length: "101"
        // content-type: "application/json"
        // host: "sell.smartstore.naver.com"
        // origin: "https://sell.smartstore.naver.com"
        // sec-fetch-dest: "empty"
        // sec-fetch-mode: "cors"
        // sec-fetch-site: "same-origin"
        // total-route-time: "0"
        // user-agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36"
        // x-current-state: "https://sell.smartstore.naver.com/#/login"
        // x-current-statename: "login"
        // x-to-statename: "login"
        //
        // accept: "*/*"
        // accept-encoding: "gzip, deflate, br"
        // accept-language: "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7"
        // connection: "keep-alive"
        // content-length: "101"
        // content-type: "application/json"
        // host: "sell.smartstore.naver.com"
        // origin: "https://sell.smartstore.naver.com"
        // sec-fetch-dest: "empty"
        // sec-fetch-mode: "cors"
        // sec-fetch-site: "same-origin"
        // user-agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36"
        // x-current-state: "https://sell.smartstore.naver.com/#/login"
        // x-current-statename: "login"
        // x-to-statename: "login"
        let body = JSON.parse(JSON.stringify(req.body));

        //TODO: contentType 별로 body 바꿀 것!
        if (headers['content-type'] == 'application/x-www-form-urlencoded') {
            body = jsonToQueryString(body);
        } else if (headers['content-type'] == 'application/json') {
            body = JSON.stringify(body);
        } else if (headers['content-type'] == 'multipart/form-data') {
            body = getFormData(body);
        }
        const response = await fetch(url, {
            headers: headers,
            agent: httpsAgent,
            method: 'POST',
            body: body,
        });

        const responseHeaders = JSON.parse(JSON.stringify(response.headers.raw()));
        const responseData = await response.text();
        for (key in responseHeaders) {
            if (key != "content-encoding") {
                res.set(key, responseHeaders[key].join(";"));
            }
        }
        // res.set("content-type","application/json");
        const result = {data: responseData, headers: responseHeaders, request: headers};
        res.json(result);
    } catch (e) {
        res.status(404).send(e.stack);
    }
});
module.exports = router;
