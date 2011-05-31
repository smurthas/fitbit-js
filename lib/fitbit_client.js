/*
 * Fitbit-js
 *
 * Copyright (c) 2011 Simon Murtha-Smith <simon@murtha-smith.com>
 */

var url = require("url"),
    http = require('http'),
    OAuth = require('oauth').OAuth,
    querystring = require("querystring");

var baseURI = 'http://api.fitbit.com/1';

module.exports = function (api_key, api_secret, callbackURI) {
    var client = {version: '0.0.0'};

    var oAuth = new OAuth('http://api.fitbit.com/oauth/request_token',
                          'http://api.fitbit.com/oauth/access_token',
                          api_key, api_secret, '1.0', callbackURI,
                          'HMAC-SHA1', null,
        {'Accept': '*/*', 'Connection': 'close', 'User-Agent': 'fitbit-js ' + client.version});
    

    function requestCallback(callback) {
        return function (err, data, response) {
            if (err) {
                callback(err, data);
            } else {
                try {
                    callback(null, JSON.parse(data));
                } catch (exc) {
                    callback(exc, data);
                }
            }
        };
    }

    function get(path, params, token, callback) {
        oAuth.get(baseURI + path + '?' + querystring.stringify(params),
                token.oauth_token, token.oauth_token_secret, requestCallback(callback));
    }

    function post(path, params, token, callback) {
        oAuth.post(baseURI + path, token.oauth_token, token.oauth_token_secret, params, null, requestCallback(callback));
    }

    // PUBLIC
    client.apiCall = function (method, path, params, callback) {
        var token = params.token;
        delete params.token;
        if (method === 'GET')
            get(path, params, token, callback);
        else if (method === 'POST')
            post(path, params, token, callback);
    }

    client.getAccessToken = function (req, res, callback) {
        var parsedUrl = url.parse(req.url, true),
            callbackUrl = (req.socket.encrypted ? 'https' : 'http') + '://' + req.headers.host + parsedUrl.pathname,
            has_token = parsedUrl.query && parsedUrl.query.oauth_token,
            has_secret = req.session.auth && req.session.auth.fitbit_oauth_token_secret;

        if(has_token &&  has_secret) { // Access token
            oAuth.getOAuthAccessToken(parsedUrl.query.oauth_token,
                                      req.session.auth.fitbit_oauth_token_secret,
                                      parsedUrl.query.oauth_verifier,
            function (error, oauth_token, oauth_token_secret, additionalParameters) {
                if (error)
                    callback(error, null);
                else
                    callback(null, {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret});
            });
        } else { // Request token
            oAuth.getOAuthRequestToken({oauth_callback: callbackUrl},
                function (error, oauth_token, oauth_token_secret, oauth_authorize_url, additionalParameters) {
                if(!error) {
                    req.session.fitbit_redirect_url = req.url;
                    req.session.auth = req.session.auth || {};
                    req.session.auth.fitbit_oauth_token_secret = oauth_token_secret;
                    req.session.auth.fitbit_oauth_token = oauth_token;
                    res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + oauth_token);
                } else {
                    callback(error, null);
                }
            });
        }
    };

    return client;
};
